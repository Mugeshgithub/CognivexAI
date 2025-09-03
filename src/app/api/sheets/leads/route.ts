import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import path from 'path';
import fs from 'fs/promises';

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || '1HlgIW79FsJwBC3YfmoTuW8HuMi4QuEWdq3ANDJpbFQw';
const SHEET_NAME = 'Sheet1'; // Default sheet name
const RANGE = `${SHEET_NAME}!A:F`;

// Function to get the first sheet name dynamically
async function getFirstSheetName(sheetsAPI: any) {
  try {
    const response = await sheetsAPI.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    const firstSheet = response.data.sheets[0];
    return firstSheet.properties.title;
  } catch (error) {
    console.error('❌ Error getting sheet name:', error);
    return 'Sheet1'; // Fallback
  }
}

// Initialize Google Sheets API
let sheets: any = null;

async function initializeSheets() {
  if (sheets) return sheets;

  try {
    const serviceAccountKeyPath = path.join(process.cwd(), 'service-account-key.json');
    const serviceAccountKey = JSON.parse(await fs.readFile(serviceAccountKeyPath, 'utf-8'));
    
    const auth = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    sheets = google.sheets({ version: 'v4', auth: auth as any });
    console.log('✅ Google Sheets API initialized');
    return sheets;
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, timestamp, sessionId, leadScore } = body;

    console.log('📝 Lead data received:', { name, email, message, timestamp, sessionId, leadScore });

    // Validate required fields
    if (!email || !sessionId) {
      return NextResponse.json(
        { error: 'Email and sessionId are required' },
        { status: 400 }
      );
    }

    // Initialize Google Sheets
    const sheetsAPI = await initializeSheets();

    // Get the actual sheet name dynamically
    const actualSheetName = await getFirstSheetName(sheetsAPI);
    const actualRange = `${actualSheetName}!A:F`;

    console.log(`📊 Using sheet: ${actualSheetName} with range: ${actualRange}`);

    // Prepare row data
    const rowData = [
      timestamp || new Date().toISOString(),
      name || 'Unknown',
      email,
      message || 'No message',
      sessionId,
      leadScore || 0
    ];

    // Append data to Google Sheets
    const response = await sheetsAPI.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: actualRange,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    });

    console.log('✅ Lead saved to Google Sheets:', response.data);

    return NextResponse.json({
      success: true,
      message: 'Lead saved successfully',
      updatedRange: response.data.updates?.updatedRange,
      updatedRows: response.data.updates?.updatedRows
    });

  } catch (error: any) {
    console.error('❌ Error saving lead to Google Sheets:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save lead',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sheetsAPI = await initializeSheets();
    
    // Get the actual sheet name dynamically
    const actualSheetName = await getFirstSheetName(sheetsAPI);
    const actualRange = `${actualSheetName}!A:F`;
    
    console.log(`📊 Using sheet: ${actualSheetName} with range: ${actualRange}`);
    
    // Get existing leads
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: actualRange,
    });

    const leads = response.data.values || [];
    console.log(`📊 Retrieved ${leads.length} leads from Google Sheets`);

    return NextResponse.json({
      success: true,
      leads: leads.slice(1), // Skip header row
      total: leads.length - 1
    });

  } catch (error: any) {
    console.error('❌ Error retrieving leads:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve leads',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
