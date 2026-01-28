import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function to proxy API requests
 * This allows us to set headers that browsers block (User-Agent, Referer, etc.)
 * 
 * Usage: /api/proxy/ICD10/root?lang=vi
 * Dynamic route: [...path] catches all paths after /api/proxy/
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Handle OPTIONS for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(200).end();
  }

  // Only allow GET requests for now
  if (req.method !== 'GET') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Extract the API path from the request
  // Vercel dynamic route: req.query.path is an array of path segments
  // e.g., /api/proxy/ICD10/root -> req.query.path = ['ICD10', 'root']
  const pathArray = req.query.path as string[] | string | undefined;
  
  let apiPath = '';
  if (pathArray) {
    if (Array.isArray(pathArray)) {
      apiPath = '/' + pathArray.join('/');
    } else {
      apiPath = '/' + pathArray;
    }
  }
  
  // If still no path, default to empty (will result in /api root)
  if (!apiPath || apiPath === '/') {
    apiPath = '';
  }

  // Build query string from query parameters
  // Exclude 'path' (internal) and '_t' (cache-bust only for client); keep API params
  const queryParams = new URLSearchParams();
  if (req.query) {
    Object.entries(req.query).forEach(([key, value]) => {
      if (key !== 'path' && key !== '_t' && value) {
        queryParams.append(key, Array.isArray(value) ? value[0] : value);
      }
    });
  }
  const queryString = queryParams.toString();
  
  // Build the target URL
  const targetUrl = `https://ccs.whiteneuron.com/api${apiPath}${queryString ? `?${queryString}` : ''}`;
  
  // Debug log
  console.log('=== Vercel Function Debug ===');
  console.log('Request URL:', req.url);
  console.log('Path array:', pathArray);
  console.log('Extracted API path:', apiPath);
  console.log('Query params:', req.query);
  console.log('Target URL:', targetUrl);
  console.log('=============================');

  try {
    // Request headers matching local/proxy behaviour (giống Request Headers khi gọi qua Vite proxy)
    const headers: Record<string, string> = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Referer': 'https://icd.kcb.vn/',
      'Sec-Ch-Ua': '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
    };

    // Optional: Cookie nếu API cần (giống local)
    headers['Cookie'] = 'NEXT_LOCALE=en';

    // X-Client-IP cho chapter data
    if (apiPath.includes('/ICD10/data/chapter')) {
      headers['X-Client-IP'] = '42.114.35.89';
    }

    // Fetch from the target API with all required headers
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers,
    });

    // Get response data
    const contentType = response.headers.get('Content-Type') || 'application/json';
    let responseBody: string;
    
    // Check if response is JSON or text
    if (contentType.includes('application/json')) {
      // For JSON, parse and stringify to ensure valid JSON
      try {
        const jsonData = await response.json();
        responseBody = JSON.stringify(jsonData);
      } catch (error) {
        // If JSON parse fails, get as text
        responseBody = await response.text();
      }
    } else {
      // For non-JSON, get as text
      responseBody = await response.text();
    }

    // Log response for debugging
    console.log('Vercel Function - Response status:', response.status);
    console.log('Vercel Function - Response contentType:', contentType);
    console.log('Vercel Function - Response body length:', responseBody?.length || 0);

    // Set response headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    // Disable browser cache
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    // Disable Vercel CDN cache
    res.setHeader('CDN-Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');

    return res.status(response.status).send(responseBody);
  } catch (error: any) {
    console.error('Proxy error:', error);
    console.error('Error stack:', error.stack);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message,
      stack: error.stack 
    });
  }
}
