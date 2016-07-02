import chai from 'chai';
import chaiRx from '../src/chai-rx';

chai.use(chaiRx);

global.assert = chai.assert;
global.expect = chai.expect;
global.should = chai.should();
