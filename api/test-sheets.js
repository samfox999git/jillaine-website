import { google } from 'googleapis'

export default async function handler(req, res) {
  const results = {}

  // 1. Check env vars exist
  results.hasSheetId = !!process.env.GOOGLE_SHEET_ID
  results.sheetId = process.env.GOOGLE_SHEET_ID || 'MISSING'
  results.hasServiceAccount = !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  results.serviceAccountLength = (process.env.GOOGLE_SERVICE_ACCOUNT_JSON || '').length

  // 2. Try parsing the service account JSON
  let credentials
  try {
    credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
    results.credentialsParsed = true
    results.clientEmail = credentials.client_email || 'NOT FOUND'
    results.projectId = credentials.project_id || 'NOT FOUND'
  } catch (err) {
    results.credentialsParsed = false
    results.credentialsError = err.message
    return res.status(200).json(results)
  }

  // 3. Try authenticating
  let auth
  try {
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    results.authCreated = true
  } catch (err) {
    results.authCreated = false
    results.authError = err.message
    return res.status(200).json(results)
  }

  // 4. Try fetching spreadsheet metadata
  try {
    const sheets = google.sheets({ version: 'v4', auth })
    const meta = await sheets.spreadsheets.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID })
    results.spreadsheetFound = true
    results.spreadsheetTitle = meta.data.properties.title
    results.tabs = meta.data.sheets.map(s => ({
      name: s.properties.title,
      sheetId: s.properties.sheetId,
    }))
  } catch (err) {
    results.spreadsheetFound = false
    results.spreadsheetError = err.message
    results.spreadsheetErrorCode = err.status || err.code
    return res.status(200).json(results)
  }

  // 5. Try writing a test row
  try {
    const sheets = google.sheets({ version: 'v4', auth })
    const sheetName = 'Intake Forms'

    const tab = results.tabs.find(t => t.name === sheetName)
    if (!tab) {
      results.tabFound = false
      results.tabError = `Tab "${sheetName}" not found. Available tabs: ${results.tabs.map(t => t.name).join(', ')}`
      return res.status(200).json(results)
    }
    results.tabFound = true

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      requestBody: {
        requests: [{
          insertDimension: {
            range: { sheetId: tab.sheetId, dimension: 'ROWS', startIndex: 1, endIndex: 2 },
            inheritFromBefore: false,
          },
        }],
      },
    })

    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `'${sheetName}'!A2`,
      valueInputOption: 'RAW',
      requestBody: { values: [['TEST ROW - DELETE ME', 'Test Name', 'test@test.com', '555-0000', '25', 'Kelowna', 'Colour', 'Pale', 'Left forearm', 'Test description', 'Google Search', '', 'No thank you']] },
    })

    results.writeSuccess = true
  } catch (err) {
    results.writeSuccess = false
    results.writeError = err.message
    results.writeErrorCode = err.status || err.code
  }

  return res.status(200).json(results)
}
