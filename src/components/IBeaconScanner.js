import React, { Component } from 'react';
import { ListView, Text, DeviceEventEmitter, StyleSheet, View } from 'react-native';
import Beacons from 'react-native-beacons-manager';
import BluetoothState from 'react-native-bluetooth-state';

export class IBeaconScanner extends Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      bluetoothState: '',
      identifier: 'Yanwei',
      uuid: '49378323-57f9-44cf-9b9c-b69db3abf1d2',
      dataSource: dataSource.cloneWithRows([])
    };

    Beacons.requestWhenInUseAuthorization();
    const region = {
      identifier: this.state.identifier,
      uuid: this.state.uuid
    };
    Beacons.startRangingBeaconsInRegion(region);
  }

  componentDidMount() {
    this.beaconsDidRange = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      data => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data.beacons)
        })
      }
    );
    BluetoothState.subscribe(
      bluetoothState => this.setState({ bluetoothState })
    );
    BluetoothState.initialize();
  }

  componentWillUnmount() {
    this.beaconsDidRange = null;
  }

  render() {
    const { bluetoothState, dataSource } = this.state;
    return (
      <View style={styles.container} >
        <Text style={styles.btleConnectionStatus}>
          Bluetooth connection status: {bluetoothState ? bluetoothState : 'NA'}
        </Text>
        <Text style={styles.headline}>
          All beacons in the area
        </Text>
        <ListView
          dataSource={dataSource}
          enableEmptySections={true}
          renderRow={this.renderRow}
        />
      </View>
    )
  }

  renderRow(rowData) {
    return (
      <View style={styles.row}>
        <Text style={styles.smallText}>
          UUID: {rowData.uuid || 'NA'}
        </Text>
        <Text style={styles.smallText}>
          Major: {rowData.major || 'NA'}
        </Text>
        <Text style={styles.smallText}>
          Minor: {rowData.minor || 'NA'}
        </Text>
        <Text>
          RSSI: {rowData.rssi || 'NA'}
        </Text>
        <Text>
          Proximity: {rowData.proximity || 'NA'}
        </Text>
        <Text>
          Distance: {rowData.accuracy.toFixed(2) || 'NA'}m
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  btleConnectionStatus: {
    fontSize: 20,
    paddingTop: 20
  },
  headline: {
    fontSize: 20,
    paddingTop: 20
  },
  row: {
    padding: 8,
    paddingBottom: 16
  },
  smallText: {
    fontSize: 11
  }
});