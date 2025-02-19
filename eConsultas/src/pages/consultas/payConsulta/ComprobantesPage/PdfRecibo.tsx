import { Consulta } from "@/api/models/consultaModels";
import { Paciente } from "@/api/models/personaModels";
import { Page, Text, View, Document, StyleSheet, Image, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderColor: '#000',
    paddingBottom: 10
  },
  logo: { width: 100, height: 100 },
  content: { 
    marginVertical: 20,
    lineHeight: 1.5
  },
  total: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right'
  }
});

export const PdfRecibo = {
  generar: async ({ consulta, paciente }: { consulta: Consulta; paciente: Paciente }) => {
    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Image src="/logo.png" style={styles.logo} />
            <View>
              <Text>Recibo N° REC-{consulta.id}</Text>
              <Text>Fecha: {new Date().toLocaleDateString()}</Text>
              <Text>Paciente: {paciente.nombre} {paciente.apellido}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text>Recibí de: {paciente.nombre} {paciente.apellido}</Text>
            <Text>La cantidad de: ${consulta.total.toFixed(2)}</Text>
            <Text>Por concepto de: Servicios médicos</Text>
            <Text>Método de pago: Tarjeta de crédito</Text>
          </View>

          <View style={styles.total}>
            <Text>Total recibido: ${consulta.total.toFixed(2)}</Text>
          </View>
        </Page>
      </Document>
    );

    const instance = pdf(doc);
    const blob = await instance.toBlob();
    return blob;
  }
};