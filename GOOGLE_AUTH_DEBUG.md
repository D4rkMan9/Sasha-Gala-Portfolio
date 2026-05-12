# Análisis de posibles causas del error "Invalid Google Token"

## Posibles causas del problema:

### 1. **GOOGLE_CLIENT_ID no configurado correctamente**
- Verificar que la variable de entorno `GOOGLE_CLIENT_ID` esté configurada en Dokploy
- El Client ID debe coincidir exactamente con el de Google Cloud Console

### 2. **Token vacío o mal formado**
- El token puede no estar llegando correctamente al backend
- Verificar que el frontend esté enviando el token correctamente

### 3. **Problema de audience en el token de Google**
- El token de Google tiene un "audience" que debe coincidir con el Client ID
- Si el Client ID en Google Cloud Console es diferente al configurado, fallará

### 4. **Problema de red/proxy**
- El token puede estar siendo modificado por el proxy
- Verificar que el Caddyfile esté configurado correctamente

### 5. **Problema de CORS**
- Aunque CORS está configurado, puede haber problemas con los headers
- Verificar que las peticiones OPTIONS se estén manejando correctamente

### 6. **Problema de tiempo del token**
- Los tokens de Google tienen un tiempo de expiración corto
- Si el token expira antes de llegar al backend, fallará

### 7. **Problema de dominio de origen**
- El Client ID de Google debe estar configurado para el dominio correcto
- Verificar que `sashagala.com.ar` esté configurado como "Authorized JavaScript origin"

### 8. **Problema de librería de Google**
- La librería `@react-oauth/google` puede tener problemas con ciertas configuraciones
- Verificar que la versión sea compatible

## Pasos para debugging:

1. **Verificar configuración de Google Cloud Console:**
   - Ir a Google Cloud Console → APIs & Services → Credentials
   - Verificar que el Client ID sea correcto
   - Verificar que `sashagala.com.ar` esté en "Authorized JavaScript origins"

2. **Probar endpoint de prueba:**
   - Hacer POST a `https://sasha-api.aguilucho.ar/api/auth/test`
   - Verificar que devuelve el Client ID correcto

3. **Verificar logs del backend:**
   - Revisar logs de Dokploy para ver qué dice el ValueError
   - Verificar que el token se está recibiendo

4. **Verificar headers de respuesta:**
   - Revisar que los headers CORS estén correctos
   - Verificar que no haya headers restrictivos

5. **Probar con un token de prueba:**
   - Usar un token de prueba de Google para verificar que la verificación funciona
