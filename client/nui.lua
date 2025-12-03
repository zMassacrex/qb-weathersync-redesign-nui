local QBCore = exports['qb-core']:GetCoreObject()
local isMenuOpen = false

-- Abrir menú
local function OpenMenu()
    -- Verificar permisos con callback al servidor
    QBCore.Functions.TriggerCallback('qb-weathermenu-nui:server:hasPermission', function(allowed)
        if not allowed then
            QBCore.Functions.Notify('No tienes permisos para usar esto', 'error', 3000)
            return
        end
        
        if isMenuOpen then return end
        
        isMenuOpen = true
        SetNuiFocus(true, true)
        
        -- Obtener hora actual del juego
        local hour, minute = GetClockHours(), GetClockMinutes()
        
        SendNUIMessage({
            action = 'open',
            states = {
                weather = 'CLEAR',
                hour = hour,
                minute = minute,
                freezeTime = false,
                dynamicWeather = true,
                blackout = false
            }
        })
    end)
end

-- Cerrar menú
local function CloseMenu()
    if not isMenuOpen then return end
    
    isMenuOpen = false
    SetNuiFocus(false, false)
    
    SendNUIMessage({
        action = 'close'
    })
end

-- Registrar comando
RegisterCommand(Config.Command, function()
    OpenMenu()
end, false)

-- Registrar keybind
if Config.Keybind then
    RegisterKeyMapping(Config.Command, 'Abrir Menu de Clima', 'keyboard', Config.Keybind)
end

-- NUI Callbacks
RegisterNUICallback('close', function(data, cb)
    CloseMenu()
    cb('ok')
end)

RegisterNUICallback('setWeather', function(data, cb)
    if data.weather then
        TriggerServerEvent('qb-weathermenu-nui:server:setWeather', data.weather)
    end
    cb('ok')
end)

RegisterNUICallback('setTime', function(data, cb)
    if data.hour ~= nil and data.minute ~= nil then
        TriggerServerEvent('qb-weathermenu-nui:server:setTime', data.hour, data.minute)
    end
    cb('ok')
end)

RegisterNUICallback('toggleFreezeTime', function(data, cb)
    TriggerServerEvent('qb-weathermenu-nui:server:toggleFreezeTime', data.state)
    cb('ok')
end)

RegisterNUICallback('toggleDynamicWeather', function(data, cb)
    TriggerServerEvent('qb-weathermenu-nui:server:toggleDynamicWeather', data.state)
    cb('ok')
end)

RegisterNUICallback('toggleBlackout', function(data, cb)
    TriggerServerEvent('qb-weathermenu-nui:server:toggleBlackout', data.state)
    cb('ok')
end)

RegisterNUICallback('syncAll', function(data, cb)
    TriggerServerEvent('qb-weathersync:server:RequestStateSync')
    cb('ok')
end)

-- Export para abrir el menú desde otros scripts
exports('OpenWeatherMenu', OpenMenu)
exports('CloseWeatherMenu', CloseMenu)

-- Sugerencia del comando
TriggerEvent('chat:addSuggestion', '/' .. Config.Command, 'Abre el menú de control de clima y tiempo')
