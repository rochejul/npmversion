/**
 * Version utils tests
 *
 * @module test/version-spec
 * @author Julien Roche
 * @version 0.0.1
 * @since 0.0.1
 */

'use strict';

describe('VersionUtils - ', function () {
    const expect = require('chai').expect;
    const VersionUtils = require('../lib/version');

    it('should exports something', function () {
        expect(VersionUtils).to.exist;
    });

    describe('and the method "unpreidPackageVersion" ', function () {
        it('should exist', function () {
            expect(VersionUtils.unpreidPackageVersion).to.exist;
        });

        it('should do nothing if no preid is detected', function () {
            expect(VersionUtils.unpreidPackageVersion('1.2.3')).equal('1.2.3');
        });

        describe('should do something ', function () {
            it('if prerelease / prepatch is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('1.2.4-0')).equal('1.2.4');
            });

            it('if preminor is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('1.3.0-0')).equal('1.3.0');
            });

            it('if premajor is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('2.0.0-0')).equal('2.0.0');
            });

            it('if prerelease / prepatch with flag is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('1.2.4-beta.0')).equal('1.2.4');
            });

            it('if preminor with flag is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('1.3.0-beta.0')).equal('1.3.0');
            });

            it('if premajor with flag is detected', function () {
                expect(VersionUtils.unpreidPackageVersion('2.0.0-beta.0')).equal('2.0.0');
            });
        });
    });

    describe('and the method "incrementPackageVersion" ', function () {
        it('should exist', function () {
            expect(VersionUtils.incrementPackageVersion).to.exist;
        });

        describe('should classicaly increment with the following options: ', function () {
            describe('Basics - ', function () {
                it('1.2.3 --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'patch')).equals('1.2.4');
                });

                it('1.2.3 --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'minor')).equals('1.3.0');
                });

                it('1.2.3 --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'major')).equals('2.0.0');
                });

                it('1.2.3 --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prerelease')).equals('1.2.4-0');
                });

                it('1.2.3 --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prepatch')).equals('1.2.4-0');
                });

                it('1.2.3 --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'preminor')).equals('1.3.0-0');
                });

                it('1.2.3 --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'premajor')).equals('2.0.0-0');
                });
            });

            describe('With prenumber - ', function () {
                it('1.2.3-0 --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'patch')).equals('1.2.3');
                });

                it('1.2.3-0 --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'minor')).equals('1.3.0');
                });

                it('1.2.3-0 --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'major')).equals('2.0.0');
                });

                it('1.2.3-0 --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prerelease')).equals('1.2.3-1');
                });

                it('1.2.3-0 --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prepatch')).equals('1.2.4-0');
                });

                it('1.2.3-0 --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'preminor')).equals('1.3.0-0');
                });

                it('1.2.3-0 --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'premajor')).equals('2.0.0-0');
                });
            });

            describe('With preid - ', function () {
                it('1.2.3-beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'patch')).equals('1.2.3');
                });

                it('1.2.3-beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'minor')).equals('1.3.0');
                });

                it('1.2.3-beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'major')).equals('2.0.0');
                });

                it('1.2.3-beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prerelease')).equals('1.2.3-beta.0');
                });

                it('1.2.3-beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prepatch')).equals('1.2.4-0');
                });

                it('1.2.3-beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'preminor')).equals('1.3.0-0');
                });

                it('1.2.3-beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'premajor')).equals('2.0.0-0');
                });
            });

            describe('With prenumber and preid - ', function () {
                it('1.2.3-beta.0 --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'patch')).equals('1.2.3');
                });

                it('1.2.3-beta.0 --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'minor')).equals('1.3.0');
                });

                it('1.2.3-beta.0 --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'major')).equals('2.0.0');
                });

                it('1.2.3-beta.0 --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prerelease')).equals('1.2.3-beta.1');
                });

                it('1.2.3-beta.0 --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prepatch')).equals('1.2.4-0');
                });

                it('1.2.3-beta.0 --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'preminor')).equals('1.3.0-0');
                });

                it('1.2.3-beta.0 --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'premajor')).equals('2.0.0-0');
                });
            });
        });

        describe('should classicaly increment with the following options (where a preid flag to "beta" is set): ', function () {
            describe('Basics - ', function () {
                it('1.2.3 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'patch', 'beta')).equals('1.2.4');
                });

                it('1.2.3 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'minor', 'beta')).equals('1.3.0');
                });

                it('1.2.3 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'major', 'beta')).equals('2.0.0');
                });

                it('1.2.3 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prerelease', 'beta')).equals('1.2.4-beta.0');
                });

                it('1.2.3 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prepatch', 'beta')).equals('1.2.4-beta.0');
                });

                it('1.2.3 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'preminor', 'beta')).equals('1.3.0-beta.0');
                });

                it('1.2.3 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'premajor', 'beta')).equals('2.0.0-beta.0');
                });
            });

            describe('With prenumber - ', function () {
                it('1.2.3-0 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'patch', 'beta')).equals('1.2.3');
                });

                it('1.2.3-0 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'minor', 'beta')).equals('1.3.0');
                });

                it('1.2.3-0 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'major', 'beta')).equals('2.0.0');
                });

                it('1.2.3-0 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prerelease', 'beta')).equals('1.2.3-beta.0');
                });

                it('1.2.3-0 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prepatch', 'beta')).equals('1.2.4-beta.0');
                });

                it('1.2.3-0 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'preminor', 'beta')).equals('1.3.0-beta.0');
                });

                it('1.2.3-0 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'premajor', 'beta')).equals('2.0.0-beta.0');
                });
            });

            describe('With preid - ', function () {
                it('1.2.3-beta --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'patch', 'beta')).equals('1.2.3');
                });

                it('1.2.3-beta --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'minor', 'beta')).equals('1.3.0');
                });

                it('1.2.3-beta --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'major', 'beta')).equals('2.0.0');
                });

                it('1.2.3-beta --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prerelease', 'beta')).equals('1.2.3-beta.0');
                });

                it('1.2.3-beta --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prepatch', 'beta')).equals('1.2.4-beta.0');
                });

                it('1.2.3-beta --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'preminor', 'beta')).equals('1.3.0-beta.0');
                });

                it('1.2.3-beta --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'premajor', 'beta')).equals('2.0.0-beta.0');
                });
            });

            describe('With prenumber and preid - ', function () {
                it('1.2.3-beta.0 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'patch', 'beta')).equals('1.2.3');
                });

                it('1.2.3-beta.0 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'minor', 'beta')).equals('1.3.0');
                });

                it('1.2.3-beta.0 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'major', 'beta')).equals('2.0.0');
                });

                it('1.2.3-beta.0 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prerelease', 'beta')).equals('1.2.3-beta.1');
                });

                it('1.2.3-beta.0 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prepatch', 'beta')).equals('1.2.4-beta.0');
                });

                it('1.2.3-beta.0 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'preminor', 'beta')).equals('1.3.0-beta.0');
                });

                it('1.2.3-beta.0 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'premajor', 'beta')).equals('2.0.0-beta.0');
                });
            });
        });

        describe('should increment with the following options (where a preid flag to "beta" is set) and where we force to add the preid if needed: ', function () {
            describe('Basics - ', function () {
                it('1.2.3 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'patch', 'beta', true)).equals('1.2.4-beta');
                });

                it('1.2.3 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'minor', 'beta', true)).equals('1.3.0-beta');
                });

                it('1.2.3 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'major', 'beta', true)).equals('2.0.0-beta');
                });

                it('1.2.3 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prerelease', 'beta', true)).equals('1.2.4-beta.0');
                });

                it('1.2.3 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'prepatch', 'beta', true)).equals('1.2.4-beta.0');
                });

                it('1.2.3 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'preminor', 'beta', true)).equals('1.3.0-beta.0');
                });

                it('1.2.3 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3', 'premajor', 'beta', true)).equals('2.0.0-beta.0');
                });
            });

            describe('With prenumber - ', function () {
                it('1.2.3-0 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'patch', 'beta', true)).equals('1.2.3-beta');
                });

                it('1.2.3-0 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'minor', 'beta', true)).equals('1.3.0-beta');
                });

                it('1.2.3-0 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'major', 'beta', true)).equals('2.0.0-beta');
                });

                it('1.2.3-0 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prerelease', 'beta', true)).equals('1.2.3-beta.0');
                });

                it('1.2.3-0 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'prepatch', 'beta', true)).equals('1.2.4-beta.0');
                });

                it('1.2.3-0 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'preminor', 'beta', true)).equals('1.3.0-beta.0');
                });

                it('1.2.3-0 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-0', 'premajor', 'beta', true)).equals('2.0.0-beta.0');
                });
            });

            describe('With preid - ', function () {
                it('1.2.3-beta --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'patch', 'beta', true)).equals('1.2.4-beta');
                });

                it('1.2.3-beta --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'minor', 'beta', true)).equals('1.3.0-beta');
                });

                it('1.2.3-beta --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'major', 'beta', true)).equals('2.0.0-beta');
                });

                it('1.2.3-beta --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prerelease', 'beta', true)).equals('1.2.3-beta.0');
                });

                it('1.2.3-beta --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'prepatch', 'beta', true)).equals('1.2.4-beta.0');
                });

                it('1.2.3-beta --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'preminor', 'beta', true)).equals('1.3.0-beta.0');
                });

                it('1.2.3-beta --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta', 'premajor', 'beta', true)).equals('2.0.0-beta.0');
                });
            });

            describe('With prenumber and preid - ', function () {
                it('1.2.3-beta.0 --preid beta --increment patch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'patch', 'beta', true)).equals('1.2.4-beta');
                });

                it('1.2.3-beta.0 --preid beta --increment minor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'minor', 'beta', true)).equals('1.3.0-beta');
                });

                it('1.2.3-beta.0 --preid beta --increment major', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'major', 'beta', true)).equals('2.0.0-beta');
                });

                it('1.2.3-beta.0 --preid beta --increment prerelease', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prerelease', 'beta', true)).equals('1.2.3-beta.1');
                });

                it('1.2.3-beta.0 --preid beta --increment prepatch', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'prepatch', 'beta', true)).equals('1.2.4-beta.0');
                });

                it('1.2.3-beta.0 --preid beta --increment preminor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'preminor', 'beta', true)).equals('1.3.0-beta.0');
                });

                it('1.2.3-beta.0 --preid beta --increment premajor', function () {
                    expect(VersionUtils.incrementPackageVersion('1.2.3-beta.0', 'premajor', 'beta', true)).equals('2.0.0-beta.0');
                });
            });
        });
    });
});
