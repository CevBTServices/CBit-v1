import fs from 'fs';

async function run() {
  try {
    const res = await fetch('https://cdcteknoloji.com.tr/hakkimizda', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    const html = await res.text();
    const regex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (match[1].includes('zaman') || match[1].includes('timeline') || match[1].includes('1960') || match[1].includes('2000') || match[1].includes('hakkimizda')) {
        console.log('Match found:', match[1]);
      } else {
        console.log('Other image:', match[1]);
      }
    }
  } catch (err) {
    console.error(err);
  }
}
run();
