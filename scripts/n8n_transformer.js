// N8N Code Node Logic
// Connect this AFTER your Notion "Get Content" node.
// Ensure the Notion node outputs all properties.

const items = $input.all();

const recentActivity = [];
let draft = 0;
let approved = 0;
let published = 0;
const byType = {};

items.forEach(item => {
    const props = item.json.properties;

    // Safe extraction of values
    const id = item.json.id;
    const title = props.Name?.title?.[0]?.plain_text || 'Untitled';
    const status = props.Status?.status?.name?.toLowerCase() || 'draft';
    const platform = props.Platform?.select?.name?.toLowerCase() || 'unknown';
    const type = props.Type?.select?.name || 'Post';
    const date = props.Date?.date?.start || new Date().toISOString();

    // Stats Logic
    if (status === 'published' || status === 'done' || status === 'complete') {
        published++;
    } else if (status === 'approved' || status === 'ready') {
        approved++;
    } else {
        draft++;
    }

    // Activity Feed Logic (All items, filter applied in Dashboard if needed, 
    // but let's send everything so the dashboard has flexibility)
    recentActivity.push({
        id: id,
        title: title,
        platform: platform,
        type: type,
        status: status === 'done' ? 'published' : status,
        date: date
    });

    // Platform count
    const platformKey = props.Platform?.select?.name || 'Unknown';
    byType[platformKey] = (byType[platformKey] || 0) + 1;
});

// Sort by Date (Descedning)
recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

return {
    content: {
        draft,
        approved,
        published,
        byType,
        recentActivity: recentActivity // <--- CRITICAL: This is what the dashboard needs
    }
};
