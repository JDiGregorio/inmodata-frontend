import type { Point } from './types'

export const TEST_POINTS: Point[] = [
  {
    id: 'p1',
    name: 'Parque Central La Ceiba',
    position: { lat: 15.778485, lng: -86.792049 },
    address: 'Parque Central, La Ceiba',
    notes: 'Punto de prueba #1',
  },
  {
    id: 'p2',
    name: 'Muelle de Cabotaje',
    position: { lat: 15.789391, lng: -86.796726 },
    address: 'Zona portuaria, La Ceiba',
    notes: 'Punto de prueba #2',
  },
  {
    id: 'p3',
    name: 'Estadio Municipal Ceibeño',
    position: { lat: 15.773787, lng: -86.812155 },
    address: 'Estadio Ceibeño',
    notes: 'Punto de prueba #3',
  },
]
