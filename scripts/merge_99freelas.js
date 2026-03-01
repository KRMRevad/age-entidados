const fs = require('fs');
const path = require('path');

const RAW_FILE = path.join(__dirname, '../squads/nexus/data/raw_opportunities.json');
const RADAR_FILE = path.join(__dirname, '../squads/nexus/data/radar_opportunities.json');

const rawData = JSON.parse(fs.readFileSync(RAW_FILE, 'utf-8'));
let radarData = [];
if (fs.existsSync(RADAR_FILE)) {
    radarData = JSON.parse(fs.readFileSync(RADAR_FILE, 'utf-8'));
}

const targetIds = [
    '99f_-8432685811939475297', // Wifeed HubSpot
    '99f_7244853838913459439', // n8n file fix
    '99f_5027267452178282743'  // n8n chatbot copilot
];

const processed = rawData.map(raw => {
    const isHot = targetIds.includes(raw.id);
    return {
        ...raw,
        status: 'evaluated',
        score: isHot ? 90 : 30,
        tier: isHot ? 'hot' : 'cool',
        effort_hours: isHot ? 15 : 5,
        proposal_draft: isHot ? 'Draft generated locally.' : ''
    };
});

// Check if already exist
const existingIds = radarData.map(r => r.id);
processed.forEach(p => {
    if (!existingIds.includes(p.id)) {
        radarData.unshift(p);
    }
});

fs.writeFileSync(RADAR_FILE, JSON.stringify(radarData, null, 2), 'utf-8');
console.log(`Merged ${processed.length} 99Freelas opportunities into radar_opportunities.json.`);
