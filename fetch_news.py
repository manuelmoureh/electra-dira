import json
import re
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

KEYWORDS = [
    "ruto", "president", "uda", "gachagua", "kalonzo", "matiang'i", "raila",
    "mt kenya", "rift valley", "nairobi", "iebc", "tifa", "infotrak",
    "gen z", "finance bill", "kura", "dira", "election", "parliament", "opposition"
]

POSITIVE_WORDS = ["support", "win", "growth", "lead", "surge", "praise", "unity", "success", "boost", "peace", "progress", "strong"]
NEGATIVE_WORDS = ["protest", "threat", "crisis", "fall", "drop", "loss", "criticize", "reject", "clash", "grief", "scandal", "warn", "defeat", "impeach"]

FEEDS = [
    {"source": "Daily Nation", "url": "https://nation.africa/kenya/rss"},
    {"source": "The Star Kenya", "url": "https://www.thestar.co.ke/rss"},
    {"source": "Capital FM", "url": "https://www.capitalfm.co.ke/news/feed/"},
]

def analyze_sentiment(title, text=""):
    content = (title + " " + text).lower()
    pos_count = sum(1 for w in POSITIVE_WORDS if w in content)
    neg_count = sum(1 for w in NEGATIVE_WORDS if w in content)

    if pos_count > neg_count:
        return "pos", "positive"
    elif neg_count > pos_count:
        return "neg", "negative"
    else:
        return "neu", "neutral"

def fetch_rss_items(feed_url, source_name):
    items = []
    try:
        req = urllib.request.Request(feed_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            
            # Channel items
            for item in root.findall('.//item')[:15]:
                title_elem = item.find('title')
                link_elem = item.find('link')
                desc_elem = item.find('description')
                pub_elem = item.find('pubDate')

                title = title_elem.text if title_elem is not None and title_elem.text else ""
                link = link_elem.text if link_elem is not None and link_elem.text else ""
                desc = desc_elem.text if desc_elem is not None and desc_elem.text else ""
                pub = pub_elem.text if pub_elem is not None and pub_elem.text else datetime.now(timezone.utc).strftime("%b %d, %H:%M EAT")

                clean_desc = re.sub('<[^<]+?>', '', desc).strip()[:200]
                
                if title:
                    items.append({
                        "title": title.strip(),
                        "link": link.strip(),
                        "summary": clean_desc,
                        "pubDate": pub.strip(),
                        "source": source_name
                    })
    except Exception as e:
        print(f"Fetch warning for {source_name}: {e}")
    return items

def fetch_and_parse():
    items = []
    seen_titles = set()

    for feed_info in FEEDS:
        raw_items = fetch_rss_items(feed_info["url"], feed_info["source"])
        for entry in raw_items:
            title = entry["title"]
            if not title or title in seen_titles:
                continue
            
            full_text = f"{title} {entry['summary']}".lower()
            matched_kw = [kw for kw in KEYWORDS if kw in full_text]
            
            if matched_kw or len(items) < 5: # include top items or keyword matched items
                seen_titles.add(title)
                tag, sentiment_label = analyze_sentiment(title, entry['summary'])
                
                items.append({
                    "headline": title,
                    "summary": entry['summary'],
                    "link": entry['link'],
                    "source": entry['source'],
                    "published": entry['pubDate'],
                    "sentiment": tag,
                    "matched_keywords": matched_kw[:3] if matched_kw else ["general"]
                })

    output = {
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "count": len(items),
        "articles": items[:20]
    }

    with open("news.json", "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    print(f"Successfully saved {len(items)} articles to news.json")

if __name__ == "__main__":
    fetch_and_parse()
