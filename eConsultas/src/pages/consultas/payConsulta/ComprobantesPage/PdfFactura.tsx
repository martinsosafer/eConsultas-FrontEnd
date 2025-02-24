import { Consulta } from "@/api/models/consultaModels";
import { Paciente } from "@/api/models/personaModels";
import { Page, Text, View, Document, StyleSheet, Image, pdf } from "@react-pdf/renderer";


const colors = {
  primary: "#000000",
  secondary: "#6c757d",
  accent: "#17a2b8",
  background: "#f8f9fa",
  lightGray: "#e9ecef",
  text: "#000000",
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    color: colors.text,
    backgroundColor: "#FFFFFF",
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
  invoiceInfo: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.primary,
  },

  // Secciones "De" y "Cobrar a"
  addressesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
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
    color: colors.primary,
  },

  // Tabla de servicios
  tableHeaderContainer: {
    flexDirection: "row",
    backgroundColor: colors.lightGray,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
    marginBottom: 5,
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
    borderColor: "#000000",
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

  // Footer / Instrucciones de pago
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#000000",
    paddingTop: 10,
  },
  instructionsTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.primary,
  },
  instructionsText: {
    fontSize: 10,
    marginBottom: 3,
  },

  // Sección extra para detallar la consulta (opcional)
  section: {
    marginBottom: 15,
  },
});

export const PdfFactura = {
  generar: async ({
    consulta,
    paciente,
  }: {
    consulta: Consulta;
    paciente: Paciente;
  }) => {
    // Si la consulta es paquete, vendrá en "serviciosContratados"
    // Caso contrario, generamos un array con un solo "servicio" :p
    const servicios =
      consulta.serviciosContratados ||
      [
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

    const primerServicio = servicios[0];
    const descuentoPaquete = primerServicio.porcentajeDescuentoPaquete;
    const descuentoObraSocial = primerServicio.porcentajeDescuentoObraSocial;
    const descuentoTotal = descuentoPaquete + descuentoObraSocial;

    const doc = (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Image src="/fullLogo.png" style={styles.logo} />
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceTitle}>Factura Médica</Text>
              <Text>Orden de compra número: FAC-{consulta.id}</Text>
              <Text>
                Fecha de orden: {new Date(consulta.fecha).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Sección "De" y "Cobrar a" */}
          <View style={styles.addressesContainer}>
            <View style={styles.fromContainer}>
              <Text style={styles.sectionTitle}>De:</Text>
              <Text>eConsultas S.A.</Text>
              <Text>Av. Colón 2340</Text>
              <Text>Condición IVA: Responsable Inscripto</Text>
            </View>
            <View style={styles.toContainer}>
              <Text style={styles.sectionTitle}>Cobrar a:</Text>
              <Text>
                Paciente: {paciente.nombre} {paciente.apellido}
              </Text>
              <Text>CUIT: 30-12345678-9</Text>
            </View>
          </View>

          {/* Sección de datos de la consulta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalle de la Consulta</Text>
            <Text>Fecha: {consulta.fecha}</Text>
            <Text>Horario: {consulta.horario}</Text>
            <Text>
              Médico: {consulta.medico.nombre} {consulta.medico.apellido} (
              {consulta.medico.especialidad})
            </Text>
          </View>

          {/* Encabezado de la tabla */}
          <View style={styles.tableHeaderContainer}>
            <Text style={styles.tableHeaderCell}>Descripción</Text>
            <Text style={styles.tableHeaderCell}>Cantidad</Text>
            <Text style={styles.tableHeaderCell}>P. Unitario</Text>
            <Text style={styles.tableHeaderCell}>Descuento</Text>
            <Text style={styles.tableHeaderCell}>Subtotal</Text>
          </View>

          {/* Filas de la tabla */}
          {servicios.map((servicio) => {
            const descTotal = descuentoTotal
            return (
              <View style={styles.tableRow} key={servicio.id}>
                <Text style={styles.tableCell}>{servicio.nombre}</Text>
                <Text style={styles.tableCell}>1</Text>
                <Text style={styles.tableCell}>
                  ${servicio.precio.toFixed(2)}
                </Text>
                <Text style={styles.tableCell}>
                  {(descTotal * 100).toFixed(0)}%
                </Text>
                <Text style={styles.tableCell}>
                  ${servicio.total.toFixed(2)}
                </Text>
              </View>
            );
          })}

          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total: ${consulta.total.toFixed(2)}
            </Text>
          </View>

          {/* Footer  */}
          <View style={styles.footer}>
            <Text style={styles.instructionsTitle}>Instrucciones de pago</Text>
            <Text style={styles.instructionsText}>
              Trasnferencia realizada a la cuenta: XXXX-XXXX-XXXX-XXXX
            </Text>
            <Text style={styles.instructionsText}>Titular: eConsultas S.A.</Text>
            <Text style={styles.instructionsText}>
              Este documento se emite a efectos de constancia de la prestación
              del servicio médico.
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
