import { Consulta } from "@/api/models/consultaModels";
import { Paciente } from "@/api/models/personaModels";
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderColor: '#000',
    paddingBottom: 10,
    marginBottom: 20 
  },
  logo: { width: 100, height: 50 },
  section: { marginBottom: 10 },
  table: { 
    flexDirection: 'row', 
    borderWidth: 1,
    marginVertical: 10,
    backgroundColor: '#f8f9fa'
  },
  tableHeader: { 
    backgroundColor: '#e9ecef',
    fontWeight: 'bold',
    padding: 5,
    borderRightWidth: 1,
    flex: 1,
    textAlign: 'center'
  },
  tableCell: { 
    padding: 5,
    borderRightWidth: 1,
    flex: 1,
    textAlign: 'center'
  },
  totalContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
    paddingRight: 20
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export const PdfFactura = {
  generar: async ({ consulta, paciente }: { consulta: Consulta; paciente: Paciente }) => {
    const servicios = consulta.serviciosContratados || [{
      id: consulta.id,
      nombre: consulta.idPaquete ? `Paquete ${consulta.idPaquete}` : `Servicio ${consulta.idServicioMedico}`,
      descripcion: consulta.idPaquete ? 'Paquete de servicios' : 'Servicio individual',
      precio: consulta.total,
      total: consulta.total,
      porcentajeDescuentoPaquete: 0,
      porcentajeDescuentoObraSocial: 0
    }];

    const blob = await (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image src="/logo.png" style={styles.logo} />
            <View>
              <Text>Factura N° FAC-{consulta.id}</Text>
              <Text>Fecha: {new Date().toLocaleDateString()}</Text>
              <Text>Paciente: {paciente.nombre} {paciente.apellido}</Text>
              <Text>CUIT: 30-12345678-9</Text>
            </View>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text>Clínica Médica SA</Text>
            <Text>Av. Siempreviva 123, CABA</Text>
            <Text>Condición IVA: Responsable Inscripto</Text>
          </View>

          <View style={styles.table}>
            <Text style={[styles.tableHeader, { flex: 3 }]}>Descripción</Text>
            <Text style={styles.tableHeader}>Cantidad</Text>
            <Text style={styles.tableHeader}>P. Unitario</Text>
            <Text style={styles.tableHeader}>Descuento</Text>
            <Text style={styles.tableHeader}>Subtotal</Text>
          </View>

          {servicios.map(servicio => {
            const descuentoTotal = consulta.porcentajeDescuentoPaquete + servicio.porcentajeDescuentoObraSocial;
            const descuentoMonto = servicio.precio * descuentoTotal;
            
            return (
              <View style={styles.table} key={servicio.id}>
                <Text style={[styles.tableCell, { flex: 3 }]}>{servicio.nombre}</Text>
                <Text style={styles.tableCell}>1</Text>
                <Text style={styles.tableCell}>${servicio.precio.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{descuentoTotal * 100}%</Text>
                <Text style={styles.tableCell}>${consulta.total.toFixed(2)}</Text>
              </View>
            );
          })}

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: ${consulta.total.toFixed(2)}
            </Text>
          </View>
        </Page>
      </Document>
    ).toBlob();
    
    return blob;
  }
};