import requests
import json
import time
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from datetime import datetime
import sys

class InformeMeteo:
    def __init__(self):
        self.api_key = "20" \
        ""
        self.playas_codigos = self.cargar_playas()
    
    def cargar_playas(self):
        """Cargar la lista de playas desde el archivo JSON"""
        try:
            with open(r"c:\Users\egusq\C2BCurso\Proyectoc2b\Playas_codigos.json", 'r', encoding='utf-8') as f:
                playas = json.load(f)
                print(f"Se cargaron {len(playas)} playas desde el archivo JSON")
                return playas
        except Exception as e:
            print(f"Error al cargar Playas_codigos.json: {e}")
            return []
    
    def obtener_playas_provincia(self, codigo_provincia):
        """Obtener playas de una provincia específica"""
        playas_provincia = [p for p in self.playas_codigos if str(p.get('ID_PROVINCIA')) == str(codigo_provincia)]
        print(f"Se encontraron {len(playas_provincia)} playas para la provincia {codigo_provincia}")
        return playas_provincia
    
    def realizar_peticion_con_reintentos(self, url, max_reintentos=3, timeout=30):
        """Realizar petición HTTP con reintentos y timeout"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        for intento in range(max_reintentos):
            try:
                print(f"Intento {intento + 1} de {max_reintentos}...")
                response = requests.get(url, headers=headers, timeout=timeout)
                response.raise_for_status()
                return response
            except requests.exceptions.Timeout:
                print(f"Timeout en intento {intento + 1}")
                if intento < max_reintentos - 1:
                    print("Esperando 5 segundos antes del siguiente intento...")
                    time.sleep(5)
            except requests.exceptions.ConnectionError as e:
                print(f"Error de conexión en intento {intento + 1}: {e}")
                if intento < max_reintentos - 1:
                    print("Esperando 5 segundos antes del siguiente intento...")
                    time.sleep(5)
            except requests.exceptions.RequestException as e:
                print(f"Error en petición en intento {intento + 1}: {e}")
                if intento < max_reintentos - 1:
                    print("Esperando 5 segundos antes del siguiente intento...")
                    time.sleep(5)
        
        return None
    
    def obtener_prediccion_playa(self, codigo_playa):
        """Obtener predicción meteorológica de una playa"""
        url = f"https://opendata.aemet.es/opendata/api/prediccion/especifica/playa/{codigo_playa}?api_key={self.api_key}"
        
        try:
            print(f"Realizando petición a la API para playa {codigo_playa}...")
            
            # Primera petición para obtener la URL de los datos
            response = self.realizar_peticion_con_reintentos(url)
            if not response:
                print("No se pudo obtener respuesta de la API después de varios intentos")
                return None
            
            data = response.json()
            print(f"Respuesta de la API: {data}")
            
            if 'datos' not in data:
                print("Error: La respuesta de la API no contiene la propiedad 'datos'")
                print(f"Respuesta completa: {data}")
                return None
            
            # Segunda petición para obtener los datos reales
            datos_url = data['datos']
            print(f"Obteniendo datos desde: {datos_url}")
            
            response_datos = self.realizar_peticion_con_reintentos(datos_url)
            if not response_datos:
                print("No se pudieron obtener los datos meteorológicos")
                return None
            
            predicciones = response_datos.json()
            
            if not predicciones or len(predicciones) == 0:
                print("Error: No se recibieron datos de predicción")
                return None
            
            print(f"Se obtuvieron datos para {len(predicciones)} ubicaciones")
            return predicciones[0]['prediccion']['dia']
        
        except json.JSONDecodeError as e:
            print(f"Error al decodificar JSON: {e}")
            return None
        except KeyError as e:
            print(f"Error: Estructura de datos inesperada: {e}")
            return None
        except Exception as e:
            print(f"Error inesperado: {e}")
            return None
    
    def crear_pdf_con_datos_ejemplo(self, nombre_playa):
        """Crear PDF con datos de ejemplo si la API no funciona"""
        print("Creando PDF con datos de ejemplo...")
        output_pdf = f"c:/Users/egusq/C2BCurso/Proyectoc2b/prediccion_ejemplo_{nombre_playa.replace(' ', '_')}.pdf"
        doc = SimpleDocTemplate(output_pdf, pagesize=A4)
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.Color(0.2, 0.65, 0.09),
            alignment=1,
            spaceAfter=30
        )
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.Color(0.1, 0.4, 0.7),
            alignment=1,
            spaceAfter=20
        )
        story = []
        title = Paragraph("Predicción Meteorológica (Datos de Ejemplo)", title_style)
        story.append(title)
        fecha_actual = datetime.now().strftime("%d/%m/%Y %H:%M")
        subtitle = Paragraph(f"Playa: {nombre_playa}<br/>Fecha del informe: {fecha_actual}<br/><i>Nota: Datos de ejemplo debido a problemas de conectividad</i>", subtitle_style)
        story.append(subtitle)
        story.append(Spacer(1, 30))
        datos_ejemplo = [
            {
                'titulo': 'Temperaturas esperadas para hoy',
                'datos': [
                    ['Hora', 'Temperatura (°C)'],
                    ['00:00', '12°C'],
                    ['06:00', '10°C'],
                    ['12:00', '18°C'],
                    ['18:00', '15°C']
                ]
            },
            {
                'titulo': 'Temperaturas esperadas para mañana',
                'datos': [
                    ['Hora', 'Temperatura (°C)'],
                    ['00:00', '11°C'],
                    ['06:00', '9°C'],
                    ['12:00', '20°C'],
                    ['18:00', '16°C']
                ]
            },
            {
                'titulo': 'Temperaturas esperadas para pasado mañana',
                'datos': [
                    ['Hora', 'Temperatura (°C)'],
                    ['00:00', '13°C'],
                    ['06:00', '11°C'],
                    ['12:00', '22°C'],
                    ['18:00', '18°C']
                ]
            }
        ]
        for tabla_info in datos_ejemplo:
            self.crear_tabla(story, tabla_info['datos'], tabla_info['titulo'], styles)
        try:
            doc.build(story)
            print(f"PDF con datos de ejemplo creado exitosamente: {output_pdf}")
            return output_pdf
        except Exception as e:
            print(f"Error al crear el PDF: {e}")
            return None
    
    def crear_pdf_prediccion(self, codigo_provincia, codigo_playa, nombre_playa):
        """Crear PDF con la predicción meteorológica de una playa"""
        
        # Obtener predicción de la API
        prediccion_dias = self.obtener_prediccion_playa(codigo_playa)
        
        if not prediccion_dias:
            print("No se pudo obtener la predicción de la API. Creando PDF con datos de ejemplo...")
            return self.crear_pdf_con_datos_ejemplo(nombre_playa)
        
        # Crear el documento PDF
        output_pdf = f"c:/Users/egusq/C2BCurso/Proyectoc2b/prediccion_{nombre_playa.replace(' ', '_')}.pdf"
        doc = SimpleDocTemplate(output_pdf, pagesize=A4)
        
        # Obtener estilos
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.Color(0.2, 0.65, 0.09),
            alignment=1,
            spaceAfter=30
        )
        
        subtitle_style = ParagraphStyle(
            'CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.Color(0.1, 0.4, 0.7),
            alignment=1,
            spaceAfter=20
        )
        
        # Contenido del documento
        story = []
        
        # Título principal
        title = Paragraph("Predicción Meteorológica", title_style)
        story.append(title)
        
        # Subtítulo con municipio y fecha
        fecha_actual = datetime.now().strftime("%d/%m/%Y %H:%M")
        subtitle = Paragraph(f"Playa: {nombre_playa}<br/>Fecha del informe: {fecha_actual}", subtitle_style)
        story.append(subtitle)
        story.append(Spacer(1, 30))
        
        # Procesar datos para cada día
        dias_nombres = ["hoy", "mañana", "pasado mañana"]
        
        for i, dia_data in enumerate(prediccion_dias[:3]):  # Solo los primeros 3 días
            if i < len(dias_nombres):
                # Obtener temperaturas del día
                temperaturas = dia_data.get('temperatura', [])
                
                # Preparar datos para la tabla
                datos_tabla = [['Hora', 'Temperatura (°C)']]
                
                for temp in temperaturas:
                    periodo = temp.get('periodo', 'N/A')
                    valor = temp.get('value', 'N/A')
                    
                    # Formatear la hora
                    if len(str(periodo)) == 2:
                        hora_formateada = f"{periodo}:00"
                    else:
                        hora_formateada = str(periodo)
                    
                    datos_tabla.append([hora_formateada, f"{valor}°C"])
                
                # Crear tabla
                self.crear_tabla(story, datos_tabla, f"Temperaturas esperadas para {dias_nombres[i]}", styles)
        
        # Construir el PDF
        try:
            doc.build(story)
            print(f"PDF creado exitosamente: {output_pdf}")
            return output_pdf
        except Exception as e:
            print(f"Error al crear el PDF: {e}")
            return None
    
    def crear_tabla(self, story, datos, titulo, styles):
        """Crear una tabla con estilos"""
        # Título de la tabla
        titulo_tabla = Paragraph(f"<b>{titulo}</b>", styles['Heading3'])
        story.append(titulo_tabla)
        story.append(Spacer(1, 10))
        
        # Crear la tabla
        tabla = Table(datos, colWidths=[2*inch, 2*inch])
        tabla.setStyle(TableStyle([
            # Estilo del encabezado
            ('BACKGROUND', (0, 0), (-1, 0), colors.Color(0.2, 0.65, 0.09)),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            
            # Estilo del cuerpo
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            
            # Filas alternadas
            ('BACKGROUND', (0, 2), (-1, -1), colors.Color(0.95, 0.95, 0.95)),
            ('BACKGROUND', (0, 1), (-1, -1), colors.white),
        ]))
        
        # Aplicar color alternado a filas pares
        for i in range(2, len(datos), 2):
            tabla.setStyle(TableStyle([
                ('BACKGROUND', (0, i), (-1, i), colors.Color(0.95, 0.95, 0.95))
            ]))
        
        story.append(tabla)
        story.append(Spacer(1, 20))
    
    def mostrar_provincias(self):
        """Mostrar las provincias disponibles"""
        provincias = {
            "48": "Bizkaia",
            "20": "Gipuzkoa", 
            "01": "Álava"
        }
        
        print("Provincias disponibles:")
        for codigo, nombre in provincias.items():
            print(f"{codigo}: {nombre}")
        
        return provincias
    
    def mostrar_playas(self, codigo_provincia):
        """Mostrar playas de una provincia"""
        playas = self.obtener_playas_provincia(codigo_provincia)
        if not playas:
            print(f"No se encontraron playas para la provincia {codigo_provincia}")
            return []
        print(f"\nPlayas disponibles en {codigo_provincia}:")
        for i, playa in enumerate(playas, 1):
            print(f"{i}: {playa.get('NOMBRE_PLAYA', 'N/A')} (ID_PLAYA: {playa.get('ID_PLAYA', 'N/A')})")
        return playas

def main():
    """Función principal para generar el informe"""
    informe = InformeMeteo()
    
    # Verificar si se cargaron las playas
    if not informe.playas_codigos:
        print("Error: No se pudieron cargar las playas. Verifica el archivo Playas_codigos.json")
        return

    # Mostrar provincias disponibles
    provincias = informe.mostrar_provincias()

    # Solicitar provincia
    codigo_provincia = input("\nIngrese el código de la provincia: ").strip()

    if codigo_provincia not in provincias:
        print(f"Código de provincia '{codigo_provincia}' no válido")
        print("Códigos válidos: " + ", ".join(provincias.keys()))
        return

    # Mostrar playas de la provincia
    playas = informe.mostrar_playas(codigo_provincia)

    if not playas:
        print("No hay playas disponibles para esta provincia")
        return

    # Solicitar playa
    try:
        entrada_usuario = input(f"\nIngrese el número de la playa (1-{len(playas)}): ").strip()
        indice = int(entrada_usuario) - 1

        if 0 <= indice < len(playas):
            playa_seleccionada = playas[indice]
            codigo_playa = playa_seleccionada.get('ID_PLAYA')
            nombre_playa = playa_seleccionada.get('NOMBRE_PLAYA')

            if not codigo_playa or not nombre_playa:
                print("Error: Datos de la playa incompletos")
                return

            print(f"\nGenerando predicción para {nombre_playa} (código: {codigo_playa})...")

            # Crear PDF con la predicción
            pdf_path = informe.crear_pdf_prediccion(codigo_provincia, codigo_playa, nombre_playa)

            if pdf_path:
                print(f"¡Informe generado exitosamente en: {pdf_path}")
            else:
                print("Error al generar el informe")
        else:
            print(f"Número de playa no válido. Debe estar entre 1 y {len(playas)}")

    except ValueError:
        print("Error: Por favor, ingrese un número válido.")
    except Exception as e:
        print(f"Error inesperado: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        id_playa = sys.argv[1]
        # Lógica para buscar la playa y generar el informe solo para ese id
        # Por ejemplo, puedes llamar a crear_pdf_prediccion o devolver datos por consola
        informe = InformeMeteo()
        provincia = None
        nombre_playa = None
        for playa in informe.playas_codigos:
            if str(playa.get('ID_PLAYA')) == str(id_playa):
                provincia = playa.get('ID_PROVINCIA')
                nombre_playa = playa.get('NOMBRE_PLAYA')
                break
        if provincia and nombre_playa:
            resultado = informe.crear_pdf_prediccion(provincia, id_playa, nombre_playa)
            print(f'PDF generado: {resultado}')
        else:
            print('Playa no encontrada')
    else:
        main()