import express from 'express';
import path from 'path';
import fs from 'fs';
import React from 'react';
import Index from '../src/js/components/Index';
import GameInterface from '../src/js/components/GameInterface';

const instructions = express.Router();

instructions.get('/', (req, res) => {
  res.render('index', {
    content: React.renderToString(<Index io={{}} />)
  });
});

instructions.get('/about', (req, res) => {
  res.render('about');
});

instructions.get('/play/:token/:time/:inc', (req, res) => {
  let params = [
    req.params.token,
    req.params.time,
    req.params.inc
  ];

  res.render('play', {
    content: React.renderToString(<GameInterface params={params} io={{}} />)
  });
});

export default instructions;
