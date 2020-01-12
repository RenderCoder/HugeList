/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import HugeList from './src/page/hugeList'

AppRegistry.registerComponent(appName, () => HugeList);
