import React, { useState, useEffect } from 'react';
import {Button, Grid} from '@material-ui/core';
import TextArea from '@mui/joy/TextArea';
import Images from '../../constants/images';
import ChatStyle from '../../styles/chat';
import ReXMessagge from '../../components/ReXMessagge';
import api from '../../api/sessions';
import OpenAI from 'openai-api';