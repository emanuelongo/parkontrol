# PARKONTROL



Equipo de Trabajo



Responsables
Emanuel Gallego Cano
Josué Gomez Granda
Dariana Lopera



























PROYECTO PARKONTROL.

Problemática: 
Los parqueaderos privados se enfrentan a problemas diarios debido a  limitaciones en su operatividad, lo cual genera un impacto negativo tanto para el parqueadero disminuyendo sus ingresos como para la experiencia de los usuarios al acceder al servicio. las problemáticas identificadas son:

Gestión ineficiente de la disponibilidad en horas picos: Cuando hay gran flujo de vehículos que entran, buscan y salen constantemente. Los usuarios suelen tardar mucho buscando una celda libre circulando innecesariamente, generando congestión y afectando su experiencia. Como es el caso de centros comerciales donde el usuario puede estar hasta entre 15-30 minutos buscando celdas libres en periodos de congestión alta.

Falta de información en tiempo real sobre la ocupación: Los operadores al no llevar un seguimiento constante carecen de datos como la ocupación y disponibilidad actual de celdas en sus instalaciones en tiempo real. Esta falta de información impide aprovechar al máximo el espacio o genera la necesidad de contratar más trabajadores para cumplir este rol.

Falta de control a distancia:  Los administradores de parqueaderos dependen de estar físicamente en el lugar para hacer seguimiento a las operaciones . No cuentan con herramientas para monitorear en tiempo real el estado del parqueadero de forma remota.

Información limitada para el seguimiento de ingresos: Muchos parqueaderos manejan su historial de ingreso con métodos manuales (registros en papel, excel). Esto dificulta obtener datos precisos de ingresos diarios, separar ingresos por mes o acceder al historial completo de reservas de cada usuario, lo que impide llevar una contabilidad precisa.

Limitaciones en el método de pago: Los parqueaderos tradicionales operan con métodos de pago limitados (efectivo) que obligan al usuario a dirigirse físicamente al punto de pago antes de autorizar su salida. Lo que puede generar filas y esperas para el usuario y limitar la posibilidad de transferir por medios digitales.






1. Objetivo del Proyecto
Desarrollar una aplicación SaaS para la gestión integral de parqueaderos, orientada a centros comerciales, universidades, hospitales y empresas con parqueaderos propios. El sistema busca optimizar el control de acceso vehicular, la administración de usuarios, la generación de métricas financieras y operativas, y el soporte multiempresa, todo desde una plataforma web moderna y escalable. que permite:
Facilitar la dinámica para el operador automatizando procesos básicos que suelen ser manuales como:  el registro de entradas y salidas, asignación de celdas y el cálculo de la tarifa de pago de reserva. Proporcionar al administrador la gestión y seguimiento mediante reportes claros y exportables, además de apoyar la toma de decisiones a través de estadísticas de ocupación, ingresos y patrones de uso, que permitan implementar estrategias y finalmente mejorar la experiencia del usuario final  reduciendo tiempos de espera y proporcionando información precisa sobre disponibilidad de espacios para poder acceder al servicio de forma rápida y sin dificultades.



 2. Funcionalidades Principales
Gestión de parqueo


Registro de entradas y salidas de vehículos.


Control en tiempo real de espacios disponibles.
Diferenciación entre parqueo de clientes, empleados y visitantes.
Asignación automática de celda disponible al iniciar reserva
Generación de alertas de estado de ocupación (máxima, alta, baja)


Gestión de vehículos y usuarios


Registro de placas, modelos y tipos de vehículos.


Creación de perfiles de usuario (administrador, operador).


Historial de parqueo por vehículo.


Reportes de ingresos
Recaudo total por día, semana, mes.


Reportes por centro comercial o empresa.


Exportación de reportes a Excel/PDF.


Métricas y visualizaciones


Promedio de ocupación del parqueadero.


Horas pico de mayor flujo: identificar qué franja horaria se llena más


Tendencias de ingresos según horarios: identificar dias mas rentables 
 número de usuarios frecuentes según tipo de clientes
Rotación de parqueo: cuántos vehículos distintos usaron la celda en un dia
Nota: estos datos permiten al administrador tomar decisiones reales e informadas como: implementar estrategias para fidelizar usuarios, incentivar usuarios frecuentes, promociones en horas de bajo flujo,  entre otros.
Gestión de pagos
Generación de Ticket único por reserva
Contabilizar tiempo de permanencia 
Calcular tarifa automática de acuerdo tiempo de permanencia 
Integración con medios de pago digitales (integrar QR al ticket) → opcional

3. Alcance del Proyecto
Backend con base de datos relacional


PostgreSQL, Oracle XE o MariaDB con modelos normalizados.


API REST para consumo de datos (FastAPI).



Interfaz para operadores y administradores


Panel simple para registrar entradas/salidas.


Dashboard administrativo con métricas y reportes.


Soporte multi empresa (multi-tenant)


Cada cliente (centro comercial, hospital, universidad) tendrá sus propios datos aislados.


Seguridad


Roles y permisos diferenciados.


Login con usuario/contraseña (luego escalable a SSO o Google).


Escalabilidad


Arquitectura lista para crecer en usuarios y clientes.



4. Beneficios para Clientes
Optimización en la administración de parqueaderos.


Reducción de errores manuales.


Información en tiempo real para la toma de decisiones.


Reportes claros que facilitan la gestión financiera.


Experiencia profesional para sus usuarios y operadores.



5. Caso de Uso de Ejemplo
Un centro comercial instala el SaaS en su parqueadero. Los operadores registran las entradas y salidas de vehículos desde un panel web. El administrador puede ver cuántos espacios quedan libres en tiempo real, cuántos ingresos generó el parqueadero en el día y cuáles son las horas pico de mayor uso. Además, puede exportar un reporte mensual para la contabilidad del centro comercial.
6. Viabilidad del proyecto
Hoy en día existen sistemas avanzados para la gestión de parqueaderos como Kioscos de autopago, sensores de disponibilidad, sistemas de cámaras, entre otros. Sin embargo estas soluciones pueden ser costosas. En nuestro caso Parkontrol es una solución accesible que no requiere hardware o equipos adicionales ideal para parqueaderos medianos - grandes independientes que buscan una automatización básica que brinda control de seguimiento, organización, proceso de pago y análisis en una sola herramienta. sin necesidad de grandes inversiones tecnológicas , pero garantizando un orden y administración informada.

EMPRESA
  id_empresa (PK)
  nombre
  direccion
1 --- N

PARQUEADERO
  id_parqueadero (PK)
  id_empresa (FK)
  nombre
  capacidad_total
  ubicacion
1 --- N

[TIPO_CELDA]
  id_tipo_celda (PK)
  nombre (ej: cliente, empleado, visitante, moto)

CELDA
  id_celda (PK)
  id_parqueadero (FK)
  id_tipo_celda (FK)
  estado
1 --- N

[ROL]
  id_rol (PK)
  nombre (solo: administrador, operador)

USUARIO
  id_usuario (PK)
  id_empresa (FK)
  nombre
  correo
  contraseña
  id_rol (FK)
1 --- N

[TIPO_VEHICULO]
  id_tipo_vehiculo (PK)
  nombre (ej: carro, moto, bicicleta)

VEHICULO
  id_vehiculo (PK)
  id_usuario (FK)
  placa
  modelo
  id_tipo_vehiculo (FK)
1 --- N

RESERVA
  id_reserva (PK)
  id_vehiculo (FK)
  id_celda (FK)
  fecha_entrada
  fecha_salida
1 --- N

[TIPO_METODO_PAGO]
  id_metodo_pago (PK)
  nombre (ej: efectivo, tarjeta, QR)   -- sin "digital"

PAGO
  id_pago (PK)
  id_reserva (FK)
  id_metodo_pago (FK)
  monto
  fecha_pago
1 --- 1

[TIPO_REPORTE]
  id_tipo_reporte (PK)
  nombre (ej: ingresos, ocupación, rotación)

[PERIODO]
  id_periodo (PK)
  nombre (ej: día, semana, mes)

REPORTE
  id_reporte (PK)
  id_parqueadero (FK)
  id_tipo_reporte (FK)
  id_periodo (FK)
  valor

