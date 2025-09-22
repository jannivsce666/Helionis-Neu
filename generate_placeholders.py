#!/usr/bin/env python3
"""
Helionis Placeholder Image Generator
Erstellt mystische SVG-Platzhalter für alle fehlenden Bilder
"""
import os

def create_mystical_svg(filename, title, color_scheme="teal"):
    """Erstellt mystische SVG-Platzhalter im Helionis-Stil"""
    
    colors = {
        "teal": {"bg": "#0a1113", "primary": "#1a6b5a", "secondary": "#0d4a3a", "text": "#c9d1d9"},
        "purple": {"bg": "#0f0a13", "primary": "#6b1a5a", "secondary": "#4a0d3a", "text": "#d1c9d9"},
        "blue": {"bg": "#0a0f13", "primary": "#1a5a6b", "secondary": "#0d3a4a", "text": "#c9d9d1"},
        "gold": {"bg": "#13100a", "primary": "#6b5a1a", "secondary": "#4a3a0d", "text": "#d9d1c9"}
    }
    
    c = colors[color_scheme]
    
    # Verschiedene mystische Symbole basierend auf Typ
    if "amulett" in filename.lower():
        symbol = """
        <circle cx="200" cy="200" r="80" fill="none" stroke="{primary}" stroke-width="3" opacity="0.8"/>
        <circle cx="200" cy="200" r="60" fill="none" stroke="{secondary}" stroke-width="2" opacity="0.6"/>
        <path d="M200,140 L230,200 L200,260 L170,200 Z" fill="{primary}" opacity="0.7"/>
        <circle cx="200" cy="200" r="15" fill="{secondary}"/>
        """.format(**c)
    elif "pyramide" in filename.lower():
        symbol = """
        <path d="M200,120 L280,280 L120,280 Z" fill="none" stroke="{primary}" stroke-width="3" opacity="0.8"/>
        <path d="M200,140 L260,260 L140,260 Z" fill="{secondary}" opacity="0.3"/>
        <line x1="200" y1="120" x2="200" y2="280" stroke="{primary}" stroke-width="2" opacity="0.6"/>
        <circle cx="200" cy="200" r="5" fill="{primary}"/>
        """.format(**c)
    elif "wuerfel" in filename.lower() or "würfel" in filename.lower():
        symbol = """
        <rect x="150" y="150" width="100" height="100" fill="none" stroke="{primary}" stroke-width="3" opacity="0.8"/>
        <rect x="160" y="160" width="80" height="80" fill="{secondary}" opacity="0.3"/>
        <circle cx="175" cy="175" r="8" fill="{primary}"/>
        <circle cx="200" cy="200" r="8" fill="{primary}"/>
        <circle cx="225" cy="225" r="8" fill="{primary}"/>
        """.format(**c)
    elif "orakel" in filename.lower() or "tarot" in filename.lower() or "runen" in filename.lower():
        symbol = """
        <rect x="160" y="130" width="80" height="140" rx="8" fill="none" stroke="{primary}" stroke-width="3" opacity="0.8"/>
        <rect x="170" y="140" width="60" height="120" rx="4" fill="{secondary}" opacity="0.3"/>
        <circle cx="200" cy="200" r="25" fill="none" stroke="{primary}" stroke-width="2"/>
        <path d="M200,185 L210,200 L200,215 L190,200 Z" fill="{primary}"/>
        """.format(**c)
    elif "pendel" in filename.lower():
        symbol = """
        <line x1="200" y1="120" x2="200" y2="220" stroke="{primary}" stroke-width="2" opacity="0.8"/>
        <circle cx="200" cy="240" r="20" fill="{secondary}" opacity="0.8"/>
        <circle cx="200" cy="240" r="12" fill="{primary}"/>
        <circle cx="200" cy="130" r="5" fill="{primary}"/>
        """.format(**c)
    elif "horoskop" in filename.lower():
        symbol = """
        <circle cx="200" cy="200" r="70" fill="none" stroke="{primary}" stroke-width="3" opacity="0.8"/>
        <circle cx="200" cy="200" r="50" fill="none" stroke="{secondary}" stroke-width="2" opacity="0.6"/>
        <path d="M200,130 L210,190 L200,200 L190,190 Z" fill="{primary}"/>
        <path d="M270,200 L210,210 L200,200 L210,190 Z" fill="{primary}"/>
        <path d="M200,270 L190,210 L200,200 L210,210 Z" fill="{primary}"/>
        <path d="M130,200 L190,190 L200,200 L190,210 Z" fill="{primary}"/>
        """.format(**c)
    else:
        # Standard mystisches Symbol
        symbol = """
        <circle cx="200" cy="200" r="60" fill="none" stroke="{primary}" stroke-width="3" opacity="0.8"/>
        <path d="M200,150 L220,200 L200,250 L180,200 Z" fill="{secondary}" opacity="0.7"/>
        <circle cx="200" cy="200" r="10" fill="{primary}"/>
        """.format(**c)
    
    svg_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="{c['bg']}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="{c['bg']}" stop-opacity="1"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <rect width="400" height="400" fill="url(#bg)"/>
  
  <!-- Mystischer Hintergrund -->
  <circle cx="100" cy="100" r="2" fill="{c['primary']}" opacity="0.4"/>
  <circle cx="300" cy="150" r="1.5" fill="{c['secondary']}" opacity="0.5"/>
  <circle cx="350" cy="300" r="2" fill="{c['primary']}" opacity="0.3"/>
  <circle cx="50" cy="350" r="1" fill="{c['secondary']}" opacity="0.6"/>
  
  <!-- Hauptsymbol -->
  <g filter="url(#glow)">
    {symbol}
  </g>
  
  <!-- Titel -->
  <text x="200" y="330" font-family="serif" font-size="14" font-weight="500" 
        text-anchor="middle" fill="{c['text']}" opacity="0.8">{title}</text>
</svg>"""
    
    return svg_content

# Bilddefinitionen mit mystischen Farbschemata
images_to_create = [
    # Kategorien
    ("assets/images/categories/amulette.jpg", "Mystische Amulette", "teal"),
    ("assets/images/categories/pyramiden.jpg", "Energiepyramiden", "purple"),
    ("assets/images/categories/wuerfel.jpg", "Mystische Würfel", "blue"),
    ("assets/images/categories/horoskope.jpg", "Persönliche Horoskope", "gold"),
    ("assets/images/categories/orakel.jpg", "Orakelkarten", "teal"),
    
    # Produkte - Amulette
    ("assets/images/products/amulett-schutz.jpg", "Schutz-Amulett", "teal"),
    ("assets/images/products/amulett-liebe.jpg", "Liebes-Amulett", "purple"),
    ("assets/images/products/amulett-wohlstand.jpg", "Wohlstands-Amulett", "gold"),
    ("assets/images/products/amulett-kraft.jpg", "Kraft-Amulett", "blue"),
    
    # Produkte - Pyramiden
    ("assets/images/products/pyramide-kristall.jpg", "Kristallpyramide", "teal"),
    ("assets/images/products/pyramide-amethyst.jpg", "Amethyst-Pyramide", "purple"),
    ("assets/images/products/pyramide-rosenquarz.jpg", "Rosenquarz-Pyramide", "purple"),
    ("assets/images/products/pyramide-chakra.jpg", "Chakra-Pyramide", "blue"),
    
    # Produkte - Würfel
    ("assets/images/products/wuerfel-meditation.jpg", "Meditations-Würfel", "blue"),
    ("assets/images/products/wuerfel-chakra.jpg", "Chakra-Würfel", "purple"),
    ("assets/images/products/wuerfel-weisheit.jpg", "Weisheits-Würfel", "gold"),
    ("assets/images/products/wuerfel-glueck.jpg", "Glücks-Würfel", "teal"),
    ("assets/images/products/wuerfel-entscheidung.jpg", "Entscheidungs-Würfel", "blue"),
    
    # Produkte - Orakel
    ("assets/images/products/orakel-deck.jpg", "Orakeldeck", "teal"),
    ("assets/images/products/runen-set.jpg", "Runen-Set", "blue"),
    ("assets/images/products/runen-nordica.jpg", "Runen Nordica", "blue"),
    ("assets/images/products/tarot-mysticum.jpg", "Tarot Mysticum", "purple"),
    ("assets/images/products/pendel-kristall.jpg", "Kristall-Pendel", "teal"),
    ("assets/images/products/pendel-intuition.jpg", "Intuitions-Pendel", "purple"),
    
    # Horoskop-Produkte
    ("assets/images/products/horoskop-personal.jpg", "Persönliches Horoskop", "gold"),
    ("assets/images/products/partnerhoroskop.jpg", "Partner-Horoskop", "purple"),
    
    # Detail-Bilder
    ("assets/images/products/detail1.jpg", "Detail 1", "teal"),
    ("assets/images/products/detail2.jpg", "Detail 2", "purple"),
    ("assets/images/products/detail3.jpg", "Detail 3", "blue"),
    
    # Horoskop-Seite
    ("assets/images/horoscope/yearly.jpg", "Jahreshoroskop", "gold"),
    ("assets/images/horoscope/partnership.jpg", "Partnerschaftshoroskop", "purple"),
    ("assets/images/horoscope/birth.jpg", "Geburtshoroskop", "teal"),
    ("assets/images/horoscope/spiritual.jpg", "Spirituelles Horoskop", "blue"),
    ("assets/images/horoscope/child.jpg", "Kinder-Horoskop", "purple"),
    ("assets/images/horoscope/monthly.jpg", "Monatshoroskop", "gold"),
    
    # Team
    ("assets/images/team/elena.jpg", "Elena Mystika", "purple"),
    ("assets/images/team/marcus.jpg", "Marcus Sage", "blue"),
    ("assets/images/team/luna.jpg", "Luna Oracle", "teal"),
    ("assets/images/team/elena-astrology.jpg", "Elena - Astrologin", "gold"),
    
    # About
    ("assets/images/about/history.jpg", "Helionis Geschichte", "teal"),
    ("assets/images/about/philosophy.jpg", "Helionis Philosophie", "purple"),
    
    # Icons
    ("assets/images/favicon.ico", "Helionis", "teal"),
    ("assets/images/apple-touch-icon.png", "Helionis", "teal"),
    ("assets/images/helionis-og.jpg", "Helionis", "teal"),
]

def main():
    print("🌫️ Generiere mystische Platzhalter-Bilder für Helionis...")
    
    for image_path, title, color_scheme in images_to_create:
        full_path = f"/Users/jannivsce666/Desktop/helionisproto/{image_path}"
        
        # SVG-Inhalt erstellen
        svg_content = create_mystical_svg(image_path, title, color_scheme)
        
        # Als SVG speichern (Browser können SVG als Bild laden)
        svg_path = full_path.rsplit('.', 1)[0] + '.svg'
        
        try:
            os.makedirs(os.path.dirname(svg_path), exist_ok=True)
            with open(svg_path, 'w', encoding='utf-8') as f:
                f.write(svg_content)
            print(f"✓ {svg_path}")
        except Exception as e:
            print(f"✗ Fehler bei {svg_path}: {e}")
    
    print(f"\n🎨 {len(images_to_create)} mystische Platzhalter-Bilder erstellt!")
    print("💡 Um die SVG-Bilder zu verwenden, ändere die Dateiendungen in den HTML-Dateien von .jpg/.png zu .svg")

if __name__ == "__main__":
    main()