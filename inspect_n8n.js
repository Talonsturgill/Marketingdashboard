const fs = require('fs');

try {
    const rawData = fs.readFileSync('n8n_response.json');
    let content = '';

    // Force UTF-16LE check
    if (rawData[0] === 0xFF && rawData[1] === 0xFE) {
        console.log('Detected UTF-16LE BOM - Decoding as utf16le');
        content = rawData.toString('utf16le');
    } else {
        console.log('No BOM detected, trying utf8');
        content = rawData.toString('utf8');
    }

    // Clean up content if needed (sometimes BOM char remains at start if not handled perfectly by toString)
    if (content.charCodeAt(0) === 65279) {
        content = content.slice(1);
    }

    const data = JSON.parse(content);
    console.log('Data parsed successfully');

    let item;
    if (Array.isArray(data)) {
        console.log(`Is Array: Yes, Length: ${data.length}`);
        item = data[0];
    } else {
        console.log('Is Object');
        if (data.results) {
            console.log('Has "results" key');
            item = data.results[0];
        } else {
            item = data;
        }
    }

    if (item) {
        console.log('\n--- SAMPLE ITEM ---');
        console.log(JSON.stringify(item, null, 2));
    }

} catch (e) {
    console.error('Error:', e.message);
}
