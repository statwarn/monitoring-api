'use strict';

// We use these library all the time, move them from user-land to standard lib.

global.async = require('async');
global.assert = require('better-assert');
global._ = require('lodash');
global.PrettyError = require('./helpers/PrettyError');
