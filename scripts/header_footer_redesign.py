import re
from pathlib import Path
root = Path('.')
new_phone = '+380800301521'
new_display = '0 800 301 521'
new_wa = 'https://wa.me/380962962121'
nav_uk = [('/avariine-vidkryttia-dverei/', 'Двері'), ('/avariine-vidkryttia-avto/', 'Авто'), ('/vidkryttia-seifiv/', 'Сейфи'), ('/vidkryttia-harazhiv/', 'Гаражі'), ('/remont-zamina-zamkiv/', 'Ремонт'), ('/raiony/', 'Райони'), ('#prices', 'Ціни'), ('#faq', 'FAQ')]
nav_ru = [('/ru/avarijnoe-vskrytie-dverej/', 'Двери'), ('/ru/avarijnoe-vskrytie-avto/', 'Авто'), ('/ru/vskrytie-sejfov/', 'Сейфы'), ('/ru/vskrytie-garazhej/', 'Гаражи'), ('/ru/remont-zamena-zamkov/', 'Ремонт'), ('/ru/raiony/', 'Районы'), ('#prices', 'Цены'), ('#faq', 'FAQ')]
service_links_uk = [('/avariine-vidkryttia-dverei/', 'Двері'), ('/avariine-vidkryttia-avto/', 'Авто'), ('/vidkryttia-seifiv/', 'Сейфи'), ('/vidkryttia-harazhiv/', 'Гаражі'), ('/remont-zamina-zamkiv/', 'Ремонт'), ('/vidkryttia-zamka-bez-poshkodzhen/', 'Без пошкоджень'), ('/zamina-sertsevyny-zamka/', 'Серцевина')]
service_links_ru = [('/ru/avarijnoe-vskrytie-dverej/', 'Двери'), ('/ru/avarijnoe-vskrytie-avto/', 'Авто'), ('/ru/vskrytie-sejfov/', 'Сейфы'), ('/ru/vskrytie-garazhej/', 'Гаражи'), ('/ru/remont-zamena-zamkov/', 'Ремонт'), ('/ru/vskrytie-zamka-bez-povrezhdeniy/', 'Без повреждений'), ('/ru/zamena-lichinki-zamka/', 'Личинка')]

def header_html(lang):
    nav = nav_ru if lang == 'ru' else nav_uk
    home = '/ru/' if lang == 'ru' else '/'
    cta_text = 'Позвонить мастеру' if lang == 'ru' else 'Викликати майстра'
    nav_items = ''.join(f'<li><a href="{href}">{label}</a></li>' for href, label in nav)
    return f'<header class="site-header"><div class="container header-inner"><a class="logo" href="{home}"><img src="/assets/images/openme-logo-header.png" alt="OpenMe"></a><button class="burger" aria-label="Menu">☰</button><nav class="main-nav" aria-label="Main navigation"><ul>{nav_items}</ul></nav><div class="header-contacts"><a class="phone" href="tel:{new_phone}">{new_display}</a><a class="cta" href="tel:{new_phone}">{cta_text}</a></div></div></header>'

def footer_html(lang):
    home = '/ru/' if lang == 'ru' else '/'
    links = service_links_ru if lang == 'ru' else service_links_uk
    services = 'Услуги' if lang == 'ru' else 'Послуги'
    regions = 'Районы' if lang == 'ru' else 'Райони'
    contacts = 'Контакты' if lang == 'ru' else 'Контакти'
    desc = 'Аварийное вскрытие замков в Киеве и области, 24/7.' if lang == 'ru' else 'Аварійне відкриття замків у Києві та області, 24/7.'
    pay = '24/7, Киев и область' if lang == 'ru' else '24/7, Київ і область'
    service_items = ''.join(f'<li><a href="{href}">{label}</a></li>' for href, label in links)
    return f'<footer class="site-footer"><div class="container footer-inner"><div class="footer-col footer-brand"><a class="footer-logo" href="{home}"><img src="/assets/images/openme-logo-header.png" alt="OpenMe"></a><p>{desc}</p></div><div class="footer-col"><h3>{services}</h3><ul>{service_items}</ul></div><div class="footer-col"><h3>{regions}</h3><ul><li><a href="{home}raiony/">{regions} Києва</a></li><li><a href="{home}">{'Головна' if lang == 'uk' else 'Главная'}</a></li></ul></div><div class="footer-col"><h3>{contacts}</h3><p><a class="phone" href="tel:{new_phone}">{new_display}</a></p><p><a id="tg-footer" href="https://t.me/Nikolay2962121">Telegram</a> · <a id="wa-footer" href="{new_wa}">WhatsApp</a></p><p>{pay}</p></div></div></footer>'

all_html = list(root.glob('**/*.html'))
for path in all_html:
    text = path.read_text(encoding='utf-8')
    text = text.replace('+380501234567', new_phone)
    text = text.replace('+38 (050) 123-45-67', new_display)
    text = text.replace('https://wa.me/380501234567', new_wa)
    lang_match = re.search(r'<html[^>]*\blang=["\'](uk|ru)["\']', text, flags=re.I)
    lang = lang_match.group(1).lower() if lang_match else ('ru' if len(path.parts) > 1 and path.parts[0] == 'ru' else 'uk')
    if '<header class="site-header">' in text:
        text = re.sub(r'<header class="site-header">.*?</header>', header_html(lang), text, flags=re.S)
    if '<footer class="site-footer">' in text:
        text = re.sub(r'<footer class="site-footer">.*?</footer>', footer_html(lang), text, flags=re.S)
    if 'hero-lock.svg' in text:
        text = text.replace('hero-lock.svg', 'hero-main.jpg')
    if '<div class="mobile-bar">' in text:
        text = re.sub(r'(<div class="mobile-bar">).*?(</div>)', \
            lambda m: m.group(1) + f'<a class="btn-call" href="tel:{new_phone}">{"Викликати майстра" if lang == 'uk' else "Позвонить мастеру"}</a>' + m.group(2), text, flags=re.S)
    else:
        mobile = f'<div class="mobile-bar"><a class="btn-call" href="tel:{new_phone}">{"Викликати майстра" if lang == 'uk' else "Позвонить мастеру"}</a></div>'
        text = re.sub(r'</body>', mobile + '</body>', text, flags=re.S)
    path.write_text(text, encoding='utf-8')
    print('Updated', path)

cfg = root / 'config.js'
cfg_text = cfg.read_text(encoding='utf-8')
cfg_text = cfg_text.replace("phone: '+380501234567'", "phone: '+380800301521'")
cfg_text = cfg_text.replace("phoneDisplay: '+38 (050) 123-45-67'", "phoneDisplay: '0 800 301 521'")
cfg_text = cfg_text.replace("whatsapp: 'https://wa.me/380501234567'", f"whatsapp: '{new_wa}'")
cfg.write_text(cfg_text, encoding='utf-8')
print('Updated config.js')
