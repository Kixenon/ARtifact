import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ARScene from './src/components/ARScene';
import BuildingInfo from './src/components/BuildingInfo';

const App = () => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  return (
    <View style={styles.container}>
      <ARScene onBuildingSelect={setSelectedBuilding} />
      
      {selectedBuilding && (
        <View style={styles.infoOverlay}>
          <BuildingInfo
            building={selectedBuilding}
            onClose={() => setSelectedBuilding(null)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;