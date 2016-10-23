import React from 'react';

import io from './io';
import Index from './components/Index';
import 'muicss';


React.render(
  <Index io={io} />,
  document.getElementById('container')
);
