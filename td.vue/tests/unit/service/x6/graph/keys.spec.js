import keys from '@/service/x6/graph/keys.js';

describe('service/x6/graph/keys.js', () => {
    let graph;

    beforeEach(() => {
        graph = {
            removeCells: jest.fn(),
            getSelectedCells: jest.fn(),
            history: {
                canUndo: jest.fn(),
                undo: jest.fn(),
                canRedo: jest.fn(),
                redo: jest.fn()
            },
            copy: jest.fn(),
            isClipboardEmpty: jest.fn(),
            paste: jest.fn(),
            cleanSelection: jest.fn(),
            select: jest.fn(),
            bindKey: jest.fn().mockImplementation((key, fn) => fn())
        };
    });

    describe('delete', () => {
        beforeEach(() => {
            keys.bind(graph);
        });

        it('binds to the delete key', () => {
            expect(graph.bindKey).toHaveBeenCalledWith('del', expect.any(Function));
        });

        it('gets the selected cells', () => {
            expect(graph.getSelectedCells).toHaveBeenCalled();
        });

        it('removes the selected cells', () => {
            expect(graph.removeCells).toHaveBeenCalled();
        });
    });

    describe('undo', () => {
        describe('canUndo is true', () => {
            beforeEach(() => {
                graph.history.canUndo.mockImplementation(() => true);
                keys.bind(graph);
            });

            it('binds to the ctrl + x keys', () => {
                expect(graph.bindKey).toHaveBeenCalledWith('ctrl+z', expect.any(Function));
            });

            it('checks if it can undo', () => {
                expect(graph.history.canUndo).toHaveBeenCalled();
            });

            it('calls undo', () => {
                expect(graph.history.undo).toHaveBeenCalled();
            });
        });

        describe('canUndo is false', () => {
            beforeEach(() => {
                graph.history.canUndo.mockImplementation(() => false);
                keys.bind(graph);
            });

            it('does not call undo', () => {
                expect(graph.history.undo).not.toHaveBeenCalled();
            });
        });
    });

    describe('redo', () => {
        describe('canRedo is true', () => {
            beforeEach(() => {
                graph.history.canRedo.mockImplementation(() => true);
                keys.bind(graph);
            });

            it('binds to the ctrl + y keys', () => {
                expect(graph.bindKey).toHaveBeenCalledWith('ctrl+y', expect.any(Function));
            });

            it('checks if it can redo', () => {
                expect(graph.history.canRedo).toHaveBeenCalled();
            });

            it('calls redo', () => {
                expect(graph.history.redo).toHaveBeenCalled();
            });
        });

        describe('canRedo is false', () => {
            beforeEach(() => {
                graph.history.canRedo.mockImplementation(() => false);
                keys.bind(graph);
            });

            it('does not call redo', () => {
                expect(graph.history.redo).not.toHaveBeenCalled();
            });
        });
    });

    describe('copy', () => {
        describe('with undefined selected cells', () => {
            beforeEach(() => {
                keys.bind(graph);
            });

            it('binds to the ctrl + c keys', () => {
                expect(graph.bindKey).toHaveBeenCalledWith('ctrl+c', expect.any(Function));
            });

            it('does not call copy', () => {
                expect(graph.copy).not.toHaveBeenCalled();
            });
        });

        describe('with 0 selected cells', () => {
            beforeEach(() => {
                graph.getSelectedCells.mockImplementation(() => []);
                keys.bind(graph);
            });

            it('does not call copy', () => {
                expect(graph.copy).not.toHaveBeenCalled();
            });
        });

        describe('with selected cells', () => {
            let cells;

            beforeEach(() => {
                cells = [{ foo: 'bar' }];
                graph.getSelectedCells.mockImplementation(() => cells);
                keys.bind(graph);
            });


            it('gets the selected cells', () => {
                expect(graph.getSelectedCells).toHaveBeenCalled();
            });

            it('copies the cells', () => {
                expect(graph.copy).toHaveBeenCalledWith(cells);
            });
        });
    });

    describe('paste', () => {
        describe('with an empty clipboard', () => {
            beforeEach(() => {
                graph.isClipboardEmpty.mockImplementation(() => true);
                keys.bind(graph);
            });

            it('binds the ctrl+v keys', () => {
                expect(graph.bindKey).toHaveBeenLastCalledWith('ctrl+v', expect.any(Function));
            });

            it('does not paste the cells', () => {
                expect(graph.paste).not.toHaveBeenCalled();
            });

            it('does not clean the selection', () => {
                expect(graph.cleanSelection).not.toHaveBeenCalled();
            });

            it('does not select the cells', () => {
                expect(graph.select).not.toHaveBeenCalled();
            });
        });

        describe('with selected cells', () => {
            let cells;

            beforeEach(() => {
                cells = [{ foo: 'bar' }];
                graph.isClipboardEmpty.mockImplementation(() => false);
                graph.paste.mockImplementation(() => cells);
                keys.bind(graph);
            });

            it('pastes the cells', () => {
                expect(graph.paste).toHaveBeenCalled();
            });

            it('cleans the selection', () => {
                expect(graph.cleanSelection).toHaveBeenCalled();
            });

            it('selects the cells', () => {
                expect(graph.select).toHaveBeenCalledWith(cells);
            });
        });
    });
});
