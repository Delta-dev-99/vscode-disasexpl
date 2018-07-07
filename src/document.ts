'use strict';

import * as vscode from 'vscode';
import { AsmParser, AsmLine, AsmFilter } from './asm';

export class DisassemblyDocument {

    private _uri: vscode.Uri;
    private _emitter: vscode.EventEmitter<vscode.Uri>;
    private _lines: AsmLine[] = [];

    constructor(uri: vscode.Uri, emitter: vscode.EventEmitter<vscode.Uri>) {
        this._uri = uri;

        // The DisassemblyDocument has access to the event emitter from
        // the containg provider. This allows it to signal changes
        this._emitter = emitter;

        vscode.workspace.openTextDocument(uri.with({ scheme: 'file' })).then(doc => {
            this._lines = new AsmParser().process(doc.getText(), new AsmFilter());
            this._emitter.fire(this._uri);
        });
    }

    get value(): string {
        let result = '';
        this._lines.forEach(line => {
            result += line.text + '\n';
        });
        return result;
    }

}
