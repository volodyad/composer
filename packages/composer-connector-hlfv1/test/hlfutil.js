/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const HLFConnection = require('../lib/hlfconnection');
const HLFSecurityContext = require('../lib/hlfsecuritycontext');
const HLFUtil = require('../lib/hlfutil');
const SecurityException = require('@sp-temp/composer-common').SecurityException;
const ChannelEventHub = require('fabric-client/lib/ChannelEventHub');


require('chai').should();
const sinon = require('sinon');

describe('HLFUtil', () => {

    let mockConnection;
    let securityContext;
    let sandbox;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        mockConnection = sinon.createStubInstance(HLFConnection);
        securityContext = new HLFSecurityContext(mockConnection);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('#securityCheck', () => {

        it('should throw for an undefined security context', () => {
            (() => {
                HLFUtil.securityCheck(undefined);
            }).should.throw(SecurityException, 'A valid SecurityContext must be specified.');
        });

        it('should throw for a null security context', () => {
            (() => {
                HLFUtil.securityCheck(null);
            }).should.throw(SecurityException, 'A valid SecurityContext must be specified.');
        });

        it('should throw for an invalid type of security context', () => {
            (() => {
                HLFUtil.securityCheck([{}]);
            }).should.throw(SecurityException, 'A valid SecurityContext must be specified.');
        });

        it('should work for a valid security context', () => {
            HLFUtil.securityCheck(securityContext);
        });

    });

    describe('#eventHubConnected', () => {

        it('should return false if eventhub isconnected returns false', () => {
            const eventhub = sinon.createStubInstance(ChannelEventHub);
            eventhub.isconnected.returns(false);
            HLFUtil.eventHubConnected(eventhub).should.be.false;
        });

        it('should return false if eventhub isconnected returns true, but checkConnection returns anything except READY', () => {
            const eventhub = sinon.createStubInstance(ChannelEventHub);
            eventhub.isconnected.returns(true);
            eventhub.checkConnection.returns('IDLE');
            HLFUtil.eventHubConnected(eventhub).should.be.false;
        });

        it('should return true if eventhub isconnected returns true, and checkConnection returns READY', () => {
            const eventhub = sinon.createStubInstance(ChannelEventHub);
            eventhub.isconnected.returns(true);
            eventhub.checkConnection.returns('READY');
            HLFUtil.eventHubConnected(eventhub).should.be.true;
        });

        it('should return false if eventhub isconnected returns false, and checkConnection returns READY', () => {
            const eventhub = sinon.createStubInstance(ChannelEventHub);
            eventhub.isconnected.returns(false);
            eventhub.checkConnection.returns('READY');
            HLFUtil.eventHubConnected(eventhub).should.be.false;
        });


    });

});
