import { NextRequest, NextResponse } from 'next/server';

const COMPANY_API_BASE_URL = 'https://jm2ulq90k2.execute-api.ca-central-1.amazonaws.com/qa/qa/api/v1/company';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get authorization header from request
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'Missing authorization header' },
                { status: 401 }
            );
        }

        console.log(`Fetching company details for ID: ${id}`);

        // Forward the request to the company details service
        const response = await fetch(`${COMPANY_API_BASE_URL}/${id}/details`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Company details service error:', errorText);
            return NextResponse.json(
                { error: 'Failed to fetch company details', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching company details:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
