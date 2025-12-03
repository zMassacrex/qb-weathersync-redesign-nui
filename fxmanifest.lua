fx_version 'cerulean'
game 'gta5'
lua54 'yes'
author 'Kakarot'
description 'Syncs the time & weather for all players on the server and allows editing by command'
version '2.1.0'

shared_scripts {
    'config.lua',
    '@qb-core/shared/locale.lua',
    'locales/en.lua',
    'locales/*.lua'
}

server_script 'server/*.lua'
client_script 'client/*.lua'

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}