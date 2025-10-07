import requests
import json
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch
from datetime import datetime

class InformeMeteo:
    def __init__(self):
        self.api_key = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhaXRvci5kb25hZG9AZ21haWwuY29tIiwianRpIjoiOWVkNGFhYzQtNTI3YS00N2YzLTg5NzMtMTNlNGIxMTE4ZDUxIiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE3MzU4MDY0NTYsInVzZXJJZCI6IjllZDRhYWM0LTUyN2EtNDdmMy04OTczLTEzZTRiMTExOGQ1MSIsInJvbGUiOiIifQ.vNGn79c-G44_Eu8MnrimYDDfHf0il9jILxXeBE2z1AE"
        self.municipios = self.cargar_municipios()
    
    def cargar_municipios(self):
        """Cargar la lista de municipios desde el archivo JSON"""
        try:
            with open(r"c:\Users\egusq\C2BCurso\Proyectoc2b\municipios.json", 'r', encoding='utf-8') as f:
                municipios = json.load(f)
                print(f"Se cargaron {len(municipios)} municipios desde el archivo JSON")
                return municipios
        except FileNotFoundError:
            print("Error: Archivo municipios.json no encontrado")
            print("Verifica que el archivo existe en la ruta especificada")
            return []
        except json.JSONDecodeError:
            print("Error: El archivo municipios.json no tiene un formato JSON válido")
            return []
    
    def obtener_municipios_provincia(self, codigo_provincia):
        """Obtener municipios de una provincia específica"""
        municipios_provincia = [m for m in self.municipios if m.get('Provincia') == codigo_provincia]
        print(f"Se encontraron {len(municipios_provincia)} municipios para la provincia {codigo_provincia}")
        return municipios_provincia
    
    def obtener_prediccion(self, codigo_municipio):
        """Obtener predicción meteorológica de un municipio"""
        url = f"https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/{codigo_municipio}?api_key={self.api_key}"
        
        try:
            print(f"Realizando petición a la API para municipio {codigo_municipio}...")
            # Primera petición para obtener la URL de los datos
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            
            if 'datos' not in data:
                print("Error: La respuesta de la API no contiene la propiedad 'datos'")
                return None
            
            # Segunda petición para obtener los datos reales
            datos_url = data['datos']
            print(f"Obteniendo datos desde: {datos_url}")
            response_datos = requests.get(datos_url)
            response_datos.raise_for_status()
            predicciones = response_datos.json()
            
            if not predicciones or len(predicciones) == 0:
                print("Error: No se recibieron datos de predicción")
                return None
            
            return predicciones[0]['prediccion']['dia']
        
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener predicción: {e}")
            return None
        except KeyError as e:
            print(f"Error: Estructura de datos inesperada: {e}")
            return None
    
    def crear_pdf_prediccion(self, codigo_provincia, codigo_municipio, nombre_municipio):
        """Crear PDF con la predicción meteorológica"""
        
        # Obtener predicción de la API
        prediccion_dias = self.obtener_prediccion(codigo_municipio)
        
        if not prediccion_dias:
            print("No se pudo obtener la predicción")
            return None
        
        # Crear el documento PDF
        output_pdf = f"c:/Users/egusq/C2BCurso/Proyectoc2b/prediccion_{nombre_municipio.replace(' ', '_')}.pdf"
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
        subtitle = Paragraph(f"Municipio: {nombre_municipio}<br/>Fecha del informe: {fecha_actual}", subtitle_style)
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
    
    def mostrar_municipios(self, codigo_provincia):
        """Mostrar municipios de una provincia"""
        municipios = self.obtener_municipios_provincia(codigo_provincia)
        
        if not municipios:
            print(f"No se encontraron municipios para la provincia {codigo_provincia}")
            return []
        
        print(f"\nMunicipios disponibles en {codigo_provincia}:")
        for i, municipio in enumerate(municipios, 1):
            print(f"{i}: {municipio.get('Municipio', 'N/A')} (Código: {municipio.get('Codigo', 'N/A')})")
        
        return municipios

def main():
    """Función principal para generar el informe"""
    informe = InformeMeteo()
    
    # Verificar si se cargaron los municipios
    if not informe.municipios:
        print("Error: No se pudieron cargar los municipios. Verifica el archivo municipios.json")
        return
    
    # Mostrar provincias disponibles
    provincias = informe.mostrar_provincias()
    
    # Solicitar provincia
    codigo_provincia = input("\nIngrese el código de la provincia: ").strip()
    
    if codigo_provincia not in provincias:
        print(f"Código de provincia '{codigo_provincia}' no válido")
        print("Códigos válidos: " + ", ".join(provincias.keys()))
        return
    
    # Mostrar municipios de la provincia
    municipios = informe.mostrar_municipios(codigo_provincia)
    
    if not municipios:
        print("No hay municipios disponibles para esta provincia")
        return
    
    # Solicitar municipio
    try:
        entrada_usuario = input(f"\nIngrese el número del municipio (1-{len(municipios)}): ").strip()
        indice = int(entrada_usuario) - 1
        
        print(f"Entrada del usuario: '{entrada_usuario}'")
        print(f"Índice calculado: {indice}")
        print(f"Rango válido: 0 a {len(municipios)-1}")
        
        if 0 <= indice < len(municipios):
            municipio_seleccionado = municipios[indice]
            codigo_municipio = municipio_seleccionado.get('Codigo')
            nombre_municipio = municipio_seleccionado.get('Municipio')
            
            if not codigo_municipio or not nombre_municipio:
                print("Error: Datos del municipio incompletos")
                return
            
            print(f"\nGenerando predicción para {nombre_municipio} (código: {codigo_municipio})...")
            
            # Crear PDF con la predicción
            pdf_path = informe.crear_pdf_prediccion(codigo_provincia, codigo_municipio, nombre_municipio)
            
            if pdf_path:
                print(f"¡Informe generado exitosamente en: {pdf_path}")
            else:
                print("Error al generar el informe")
        else:
            print(f"Número de municipio no válido. Debe estar entre 1 y {len(municipios)}")
            print(f"Usted ingresó: {entrada_usuario} (índice: {indice})")
            
    except ValueError as e:
        print(f"Error: Por favor, ingrese un número válido. Entrada recibida: '{entrada_usuario}'")
        print(f"Detalles del error: {e}")
    except Exception as e:
        print(f"Error inesperado: {e}")

if __name__ == "__main__":
    main()