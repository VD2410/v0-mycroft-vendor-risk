import { NextRequest, NextResponse } from 'next/server';

const COMPANY_API_BASE_URL = 'https://4zg47io536.execute-api.ca-central-1.amazonaws.com/dev/dev/api/v1/company';
const DATAPIPELINE_URL = 'https://jm2ulq90k2.execute-api.ca-central-1.amazonaws.com/qa/qa/api/v1/company';
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        console.log(`Triggering datapipeline for company ID: ${id}, name: ${body.name}`);

        // Forward the request to the datapipeline service without auth
        const response = await fetch(`${DATAPIPELINE_URL}/${id}/datapipeline`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Datapipeline service error:', errorText);
            return NextResponse.json(
                { error: 'Failed to trigger datapipeline', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Datapipeline triggered successfully:', data);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error triggering datapipeline:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
