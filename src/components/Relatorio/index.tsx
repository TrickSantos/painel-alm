import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { IPresencas } from "../../pages/Presencas";
import titleCase from "../../util/titleCase";

type Props = {
  evento: Evento;
  dados: IPresencas[];
};

const Relatorio = (props: Props) => (
  <Document>
    <Page style={styles.body}>
      <Text style={styles.title}>
        Clubes presentes em: {`${props.evento.nome}`}
      </Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text>Posição</Text>
          </View>
          <View style={styles.name}>
            <Text>Clube</Text>
          </View>
          <View style={styles.column}>
            <Text>Porcentagem</Text>
          </View>
        </View>
        {props.dados.map((clube, index) => (
          <View key={clube.id} style={styles.row}>
            <View style={styles.column}>
              <Text>{index + 1}</Text>
            </View>
            <View style={styles.name}>
              <Text>{titleCase(clube.nome)}</Text>
            </View>
            <View style={styles.column}>
              <Text>{`${clube.porcentagem}%`}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 25,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 5,
    borderBottom: 1,
  },
  column: {
    width: "auto",
  },
  name: {
    flex: 1,
    textAlign: "center",
  },
});

export default Relatorio;
