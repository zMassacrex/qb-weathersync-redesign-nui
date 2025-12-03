local QBCore = exports['qb-core']:GetCoreObject()

-- Función para verificar permisos
local function HasPermission(source)
    local Player = QBCore.Functions.GetPlayer(source)
    if not Player then return false end
    
    -- Verificar por grupo de permisos de QBCore
    for _, group in ipairs(Config.AllowedGroups) do
        if QBCore.Functions.HasPermission(source, group) then
            return true
        end
    end
    
    -- También verificar si es admin por job (opcional)
    local job = Player.PlayerData.job
    if job and job.name == 'admin' then
        return true
    end
    
    return false
end

-- Callback para verificar permisos desde el cliente
QBCore.Functions.CreateCallback('qb-weathermenu-nui:server:hasPermission', function(source, cb)
    cb(HasPermission(source))
end)

-- Función para log de acciones
local function LogAction(source, action, details)
    local Player = QBCore.Functions.GetPlayer(source)
    if Player then
        local name = Player.PlayerData.charinfo.firstname .. ' ' .. Player.PlayerData.charinfo.lastname
        local citizenid = Player.PlayerData.citizenid
        print(string.format('^3[qb-weathermenu-nui]^7 %s (%s) - %s: %s', name, citizenid, action, details))
    end
end

-- Evento para cambiar el clima (usa evento nativo de qb-weathersync)
RegisterNetEvent('qb-weathermenu-nui:server:setWeather', function(weatherType)
    local src = source
    
    if not HasPermission(src) then
        TriggerClientEvent('QBCore:Notify', src, 'No tienes permisos', 'error')
        return
    end
    
    -- Usar evento nativo de qb-weathersync
    TriggerEvent('qb-weathersync:server:setWeather', weatherType)
    LogAction(src, 'WEATHER', weatherType)
end)

-- Evento para cambiar la hora
RegisterNetEvent('qb-weathermenu-nui:server:setTime', function(hour, minute)
    local src = source
    
    if not HasPermission(src) then
        TriggerClientEvent('QBCore:Notify', src, 'No tienes permisos', 'error')
        return
    end
    
    hour = tonumber(hour) or 12
    minute = tonumber(minute) or 0
    
    hour = math.max(0, math.min(23, hour))
    minute = math.max(0, math.min(59, minute))
    
    -- Usar evento nativo de qb-weathersync
    TriggerEvent('qb-weathersync:server:setTime', hour, minute)
    LogAction(src, 'TIME', string.format('%02d:%02d', hour, minute))
end)

-- Evento para toggle de congelar tiempo
RegisterNetEvent('qb-weathermenu-nui:server:toggleFreezeTime', function(state)
    local src = source
    
    if not HasPermission(src) then
        TriggerClientEvent('QBCore:Notify', src, 'No tienes permisos', 'error')
        return
    end
    
    -- Usar evento nativo de qb-weathersync
    TriggerEvent('qb-weathersync:server:toggleFreezeTime', state)
    LogAction(src, 'FREEZE_TIME', tostring(state))
end)

-- Evento para toggle de clima dinámico
RegisterNetEvent('qb-weathermenu-nui:server:toggleDynamicWeather', function(state)
    local src = source
    
    if not HasPermission(src) then
        TriggerClientEvent('QBCore:Notify', src, 'No tienes permisos', 'error')
        return
    end
    
    -- Usar evento nativo de qb-weathersync
    TriggerEvent('qb-weathersync:server:toggleDynamicWeather', state)
    LogAction(src, 'DYNAMIC_WEATHER', tostring(state))
end)

-- Evento para toggle de blackout
RegisterNetEvent('qb-weathermenu-nui:server:toggleBlackout', function(state)
    local src = source
    
    if not HasPermission(src) then
        TriggerClientEvent('QBCore:Notify', src, 'No tienes permisos', 'error')
        return
    end
    
    -- Usar evento nativo de qb-weathersync
    TriggerEvent('qb-weathersync:server:toggleBlackout', state)
    LogAction(src, 'BLACKOUT', tostring(state))
end)

print('^2[qb-weathermenu-nui]^7 Recurso NUI iniciado correctamente')
print('^2[qb-weathermenu-nui]^7 Comando: /' .. Config.Command)
if Config.Keybind then
    print('^2[qb-weathermenu-nui]^7 Keybind: ' .. Config.Keybind)
end
