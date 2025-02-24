import { Consulta } from "@/api/models/consultaModels";
import { Paciente } from "@/api/models/personaModels";
import { Page, Text, View, Document, StyleSheet, Image, pdf } from "@react-pdf/renderer";

const colors = {
  text: "#000000",
  lightGray: "#e9ecef",
  background: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.background,
    fontFamily: "Helvetica",
  },
  // Encabezado principal
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 115,
    height: 70,
    marginRight: 10,
  },
  receiptInfo: {
    alignItems: "flex-end",
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.text,
  },

  // Secciones "De" y "Para"
  addressesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  fromContainer: {
    width: "45%",
  },
  toContainer: {
    width: "45%",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.text,
  },

  // Tabla de servicios
  tableHeaderContainer: {
    flexDirection: "row",
    backgroundColor: colors.lightGray,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.text,
    marginTop: 10,
  },
  tableHeaderCell: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: colors.text,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    padding: 5,
  },

  // Sección de total
  totalContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
  },

  // Footer
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: colors.text,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 10,
    marginBottom: 3,
  },
});

export const PdfRecibo = {
  generar: async ({
    consulta,
    paciente,
  }: {
    consulta: Consulta;
    paciente: Paciente;
  }) => {
    // Tomamos la misma lógica de "serviciosContratados" para mantener coherencia :D
    const servicios =
      consulta.serviciosContratados || [
        {
          id: consulta.id,
          nombre: consulta.idPaquete
            ? `Paquete ${consulta.idPaquete}`
            : `Servicio ${consulta.idServicioMedico}`,
          descripcion: consulta.idPaquete
            ? "Paquete de servicios"
            : "Servicio individual",
          precio: consulta.total,
          total: consulta.total,
          porcentajeDescuentoPaquete: 0,
          porcentajeDescuentoObraSocial: 0,
        },
      ];

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image src="/fullLogo.png" style={styles.logo} />
            </View>
            <View style={styles.receiptInfo}>
              <Text style={styles.receiptTitle}>Recibo de Pago</Text>
              <Text>Recibo N°: REC-{consulta.id}</Text>
              <Text>Fecha: {new Date(consulta.fecha).toLocaleDateString()}</Text>
            </View>
          </View>

          {/* Sección "De" y "Para" */}
          <View style={styles.addressesContainer}>
            <View style={styles.fromContainer}>
              <Text style={styles.sectionTitle}>De:</Text>
              <Text>eConsultas S.A.</Text>
              <Text>Av. Colón 2340</Text>
              <Text>Condición IVA: Responsable Inscripto</Text>
            </View>
            <View style={styles.toContainer}>
              <Text style={styles.sectionTitle}>Para:</Text>
              <Text>
                {paciente.nombre} {paciente.apellido}
              </Text>
              <Text>CUIT: 30-12345678-9</Text>
            </View>
          </View>

          {/* Tabla simplificada  */}
          <View style={styles.tableHeaderContainer}>
            <Text style={styles.tableHeaderCell}>Descripción</Text>
            <Text style={styles.tableHeaderCell}>Cantidad</Text>
            <Text style={styles.tableHeaderCell}>Precio</Text>
            <Text style={styles.tableHeaderCell}>Subtotal</Text>
          </View>

          {servicios.map((servicio) => (
            <View style={styles.tableRow} key={servicio.id}>
              <Text style={styles.tableCell}>{servicio.nombre}</Text>
              <Text style={styles.tableCell}>1</Text>
              <Text style={styles.tableCell}>${servicio.precio.toFixed(2)}</Text>
              <Text style={styles.tableCell}>${servicio.total.toFixed(2)}</Text>
            </View>
          ))}

          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total Recibido: ${consulta.total.toFixed(2)}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Este documento se emite a efectos de constancia de pago.
            </Text>
          </View>
        </Page>
      </Document>
    );

    const instance = pdf(doc);
    const blob = await instance.toBlob();
    return blob;
  },
};
