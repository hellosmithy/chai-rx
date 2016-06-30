import chai from 'chai';
import chaiRx from '../src/chai-rx';

chai.use(chaiRx);

global.expect = chai.expect;
