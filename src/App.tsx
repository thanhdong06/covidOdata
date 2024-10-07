
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  MapsComponent, LayersDirective, LayerDirective, Inject, MapsTooltip, Legend,  MarkersDirective,
  MarkerDirective,ITooltipRenderEventArgs
} from '@syncfusion/ej2-react-maps';
import {
  TreeMapComponent, TreeMapTooltip, TreeMapLegend, ITreeMapTooltipRenderEventArgs
} from '@syncfusion/ej2-react-treemap';

import './App.css';

interface CovidData {
  id: number;
  personConfirmed: number;
  personDeath: number;
  CountryRegion: {
    countryName: string;
  };
}

interface GroupedData {
  name: string;
  personConfirmed: number;
  personDeath: number;
}

const App = () => {
  const [datas, setDatas] = useState<GroupedData[]>([]);
  const [displayType, setDisplayType] = useState<'Confirmed' | 'Death'>('Confirmed');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5268/odata/CovidDailies?$select=id,personConfirmed,personDeath&$expand=CountryRegion($select=countryName)');
      const data: CovidData[] = response.data.value;

      // Group by country name and sum up the values
      const groupedData = data.reduce<Record<string, GroupedData>>((acc, item) => {
        const countryName = item.CountryRegion.countryName.toString();
        if (!acc[countryName]) {
          acc[countryName] = { name: countryName, personConfirmed: 0, personDeath: 0 };
        }
        acc[countryName].personConfirmed += item.personConfirmed;
        acc[countryName].personDeath += item.personDeath;
        return acc;
      }, {});
      
      const mappedData = Object.values(groupedData);
      setDatas(mappedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDisplayTypeChange = useCallback((type: 'Confirmed' | 'Death') => {
    setDisplayType(type);
  }, []);

  const memoizedLeafItemSettings = useMemo(() => ({
    labelPath: 'name',
    labelPosition: 'TopCenter',
    labelFormat: displayType === 'Confirmed' ? '${name}<br>${personConfirmed}' : '${name}<br>${personDeath}',
  }), [displayType]);

  const mapTooltipRender = (args: ITooltipRenderEventArgs) => {
    if (args.data) {
      const countryData = datas.find((data) => data.name === (args.data as { Name: string }).Name);
      if (countryData) {
        args.content = `${countryData.name}<br/>Confirmed: ${countryData.personConfirmed}<br/>Deaths: ${countryData.personDeath}`;
      }
    }
  };

  return (
    <div>
      <h1>COVID-19 Data</h1>
      <div>
        <button onClick={() => handleDisplayTypeChange('Confirmed')}>Confirmed</button>
        <button onClick={() => handleDisplayTypeChange('Death')}>Death</button>
      </div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          <h2>Tree Map</h2>
          <TreeMapComponent
            id='treemap'
            dataSource={datas}
            weightValuePath={displayType === 'Confirmed' ? 'personConfirmed' : 'personDeath'}
            palette={['green', 'blue', 'pink', 'red', 'orange']}
            leafItemSettings={memoizedLeafItemSettings}
          >
            <Inject services={[TreeMapLegend, TreeMapTooltip]} />
          </TreeMapComponent>

          <h2>World Map</h2>
          <MapsComponent
            id="maps"
            titleSettings={{
              text: 'Values',
              textStyle: { size: '16px' }
            }}
            legendSettings={{
              visible: true,
              position: 'Top',
              orientation: 'Horizontal'
            }}
            tooltipRender={mapTooltipRender}
          >
            <Inject services={[MapsTooltip, Legend]} />
            <LayersDirective>
              <LayerDirective
                shapeData={require('./countries.json')} 
                dataLabelSettings={ {
                        visible: true,
                        labelPath: 'name',
                        smartLabelMode: 'Trim'
                    } }
                shapePropertyPath="name"
                shapeDataPath="name"
                dataSource={datas}
                shapeSettings={{
                  colorValuePath: displayType === 'Confirmed' ? 'personConfirmed' : 'personDeath',
                  fill: '#E5E5E5',
                  border: { color: 'black', width: 0.5 },
                  colorMapping: [
                    {
                      from: 0,
                      to: 50000,
                      color: '#316DB5',
                    },
                    {
                      from: 50000,
                      to: 100000,
                      color: '#D84444',
                    },          
                    {
                      from: 100000,
                      to: 200000,
                      color: '#344b70',
                    },
                    {
                      from: 200000,
                      to: 1000000,
                      color: '#ff1493',
                    },
                    {
                      from: 1000000,
                      to: 10000000,
                      color: '#a84f67',
                    },
                  ]
                }}
              />
            </LayersDirective>
          </MapsComponent>
        </div>
        
      )}
    </div>
  );
}

export default App;