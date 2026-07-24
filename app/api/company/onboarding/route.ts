import { NextRequest, NextResponse } from 'next/server';

const COMPANY_ONBOARDING_URL = 'https://4zg47io536.execute-api.ca-central-1.amazonaws.com/dev/dev/api/v1/company/onboarding';

export async function GET(request: NextRequest) {
    try {
        // Get authorization header from request
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: 'Missing authorization header' },
                { status: 401 }
            );
        }

        // Get uid from query params if provided
        const searchParams = request.nextUrl.searchParams;
        const uid = searchParams.get('uid');

        let url = COMPANY_ONBOARDING_URL;
        if (uid) {
            url += `?uid=${uid}`;
        }

        // Forward the request to the onboarding service
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Company onboarding service error:', errorText);
            return NextResponse.json(
                { error: 'Failed to fetch company onboarding data', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching company onboarding:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
