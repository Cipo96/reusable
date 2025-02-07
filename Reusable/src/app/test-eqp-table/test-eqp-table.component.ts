import { Component, OnInit, TemplateRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CellAlignmentEnum, ConfigColumn, ExportEqpTable, NumberColumnPipe, TooltipPositionType, CustomButton, TableColumnField } from 'projects/eqp-common/src/public-api';
import { GenderEnum } from '../app.component';
import * as it from "../../app/i18n/it.json";
import { TranslateService } from '@ngx-translate/core';
import { CustomExportType, TypeColumn } from 'projects/eqp-common/src/public-api';
import { EqpAttachmentDialogService } from '@eqproject/eqp-attachments';
import { EqpTableService, EqpTableComponent, TranslateTableHelper } from 'projects/eqp-table/src/public-api';

@Component({
  selector: 'app-test-eqp-table',
  templateUrl: './test-eqp-table.component.html',
  styleUrls: ['./test-eqp-table.component.scss']
})
export class TestEqpTableComponent implements OnInit {
  disableRowTest: boolean = true;
  columns: Array<TableColumnField>;
  @ViewChild('eqpTable', { static: false }) eqpTable: EqpTableComponent;

  @ViewChild("externalTemplate", { static: true }) externalTemplate: TemplateRef<any>;
  test;
  customButtons: Array<CustomButton> = new Array<CustomButton>();

  DATA: any[] = [
    {
      ID: 0,
      fullName: { name: "Andrea", surname: "Cipollone" },
      BirthDate: new Date(1996, 3, 30),
      Gender: GenderEnum.MALE,
      sino: { test: true },
      nosi: true,
      FiscalCode: "CPLNDR96D30G482X",
      SerialNumber: "654321",
      ElementLists: [{ label: 'Prova Andrea', value: 'Testo di prova Andrea' }, { label: 'Prova 2 Andrea', value: "Testo di prova 2 Andrea" }],
      Price: 2.39,
      DecimalValue: 1.88,
      PercentageValue: 0.75,
      color: "#008ca8",
      booleanValue: true,
      Icons: [{ className: "fa fa-check", tooltip: "Icona 1" }, { className: "fa fa-trash", tooltip: "Icona 2" }],
      Link: "https://www.google.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessandro", surname: "Di Salvatore" },
      BirthDate: null,
      Gender: GenderEnum.MALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "CPLNDR96D30G482X",
      SerialNumber: "123456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb4e4e",
      booleanValue: false,
      Icons: [],
      Link: "https://meet.google.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    },
    {
      ID: 0,
      fullName: { name: "Alessia", surname: "D'Alberto" },
      BirthDate: new Date(1994, 7, 6),
      Gender: GenderEnum.FEMALE,
      sino: { test: true },
      nosi: false,
      FiscalCode: "DASDASDSADSADAS",
      SerialNumber: "789456",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2,
      color: "#fb8e4e",
      booleanValue: true,
      Icons: [{ className: "fa fa-circle", tooltip: "Icona 3" }],
      Link: "https://www.booking.com/",
      External_t: 654321
    }
  ];

  DATA2: any[] = [
    {
      ID: 0,
      fullName: { name: "Andrea", surname: "Cipollone" },
      BirthDate: new Date(1996, 3, 30),
      Gender: 1,
      sino: { test: true },
      nosi: true,
      FiscalCode: "CPLNDR96D30G482X",
      SerialNumber: "#ff0000",
      ElementLists: [{ label: 'Prova Andrea', value: 'Testo di prova Andrea' }, { label: 'Prova 2 Andrea', value: "Testo di prova 2 Andrea" }],
      Price: 2.39,
      DecimalValue: 1.88,
      PercentageValue: 0.75
    },
    {
      ID: 0,
      fullName: { name: "Alessandro", surname: "Di Salvatore" },
      BirthDate: new Date(1988, 0, 12),
      Gender: 1,
      sino: { test: true },
      nosi: false,
      FiscalCode: "CPLNDR96D30G482X",
      SerialNumber: "#ff0000",
      ElementLists: [{ label: 'Prova Ale', value: 'Testo di prova Ale' }, { label: 'Prova 2', value: "Testo di prova 2 Ale" }],
      Price: 2,
      DecimalValue: 1.58,
      PercentageValue: 0.2
    },
  ];

  exportEqpTable: ExportEqpTable = {
    buttonIcon: "download",
    buttonText: "Prova",
    buttonTextTranslateKey: "AAA.BBB",
    showButtonBorder: false,
    tooltipText: "Pippo",
    tooltipPosition: TooltipPositionType.Right,
    hiddenColumns: [10],
    exportFileType: CustomExportType.CustomXLS,
    customExportFunction: [() => { this.export() }],
  };

  constructor(private eqpTableService: EqpTableService, private translateTableHelper: TranslateTableHelper, public translate: TranslateService) {
    let currentTranslationJson = it["default"];
    this.translate.setTranslation("it", currentTranslationJson, true);
    this.translate.use("it");
    this.translateTableHelper.loadTranslateService(this.translate);
    this.eqpTableService.setLanguage("it-IT");
  }

  ngOnInit(): void {

    this.injectCustomButtons();
    this.columns = [

      {
        key: "name",
        value: "fullName.name",
        display: "Prova",
        tooltip: { tooltipText: (element) => this.getTooltipName(element) },
        styles: { minWidth: "250px" },
        isSticky: false
      },
      {
        key: "surname",
        value: "fullName.surname",
        display: "Cognome",
        tooltip: { tooltipText: (element) => this.getTooltipSurname(element) },
        styles: { minWidth: "250px" },
        isSticky: false
      },
      {
        key: "BirthDate",
        value: (element) => { return element.BirthDate },
        display: "Data senza formato",
        type: TypeColumn.Date,
        tooltip: { tooltipText: "Colonna di tipo Date senza formato specifico" },
        styles: { minWidth: "250px" },
      },
      {
        key: "Gender",
        display: "Sesso (Enum)",
        type: TypeColumn.Enum,
        enumModel: GenderEnum,
        tooltip: { tooltipText: "Colonna di tipo Enum" },
        multilanguagePrefixKey: "ENUMS.GENDER.",
        styles: { minWidth: "500px" },
      }
      ,
      {
        key: "nosi",
        display: "Colonna Booleana",
        type: TypeColumn.Boolean,
        booleanValues: { true: '<i class="fa fa-close"></i>', false: '<i class="fa fa-check"></i>' },
        tooltip: { tooltipText: "HOLA" },
        styles: { minWidth: "500px" },
      },
      // {
      //   key: "color",
      //   display: "Colonna Colore",
      //   type: TypeColumn.Color,
      //   tooltip: { tooltipText: "Colonna per il colore" },
      //   styles: { flex: "0 0 10%" }
      // },

      // {
      //   key: "BirthDate2",
      //   value: "BirthDate",
      //   display: "Data con formato",
      //   type: TypeColumn.Date,
      //   tooltip: { tooltipText: "Colonna di tipo Date con formato specifico" },
      //   format: "yyyy-MM-dd",
      //   styles: { flex: "0 0 10%" }
      // },

      // {
      //   key: "booleanValue",
      //   display: "Checkbox",
      //   type: TypeColumn.Checkbox,
      //   tooltip: { tooltipText: "Colonna di tipo Checkbox" },
      //   disabled: true,
      //   styles: { flex: "0 0 10%" },
      //   isSticky: false
      // },
      // {
      //   key: "Icons",
      //   display: "Icone",
      //   type: TypeColumn.Icon,
      //   tooltip: { tooltipText: "Colonna di tipo Checkbox" },
      //   disabled: true,
      //   styles: { flex: "0 0 10%" }
      // },
      // {
      //   key: "Link",
      //   display: "Link",
      //   type: TypeColumn.Hyperlink,
      //   hyperlink: { hyperlinkUrl: "https://google.com", hyperlinkText: "Link", isTargetBlank: true },
      //   tooltip: { tooltipText: "Colonna di tipo Hyperlink" },
      //   styles: { flex: "0 0 10%" }
      // },
      // {
      //   key: "Price",
      //   display: "Prezzo",
      //   numberPipe: NumberColumnPipe.CURRENCY,
      //   currencyPipeCode: (element) => { return "USD"; },
      //   styles: { flex: "0 0 10%" }
      // },
      // {
      //   key: "DecimalValue",
      //   display: "Valore decimale",
      //   numberPipe: NumberColumnPipe.DECIMAL,
      //   styles: { flex: "0 0 10%" }
      // },
      // {
      //   key: "PercentageValue",
      //   display: "Valore percentuale",
      //   numberPipe: NumberColumnPipe.PERCENT,
      //   styles: { flex: "0 0 10%" }
      // },
      {
        key: "External_t",
        display: "Template esterno",
        type: TypeColumn.ExternalTemplate,
        externalTemplate: this.externalTemplate,
        styles: { minWidth: "500px" },
        externalTemplateSearchFunction: (row) => this.testSearch(row)
      }
      // ,
      // {
      //   key: "external_t2",
      //   display: "Template esterno2",
      //   type: TypeColumn.ExternalTemplate,
      //   externalTemplate: this.externalTemplate,
      //   styles: { flex: "0 0 10%" }
      // }
      // ,
      // {
      //   key: "external_t3",
      //   display: "Template esterno3",
      //   type: TypeColumn.ExternalTemplate,
      //   externalTemplate: this.externalTemplate,
      //   styles: { flex: "0 0 10%" }
      // }
      // ,
      // {
      //   key: "external_t4",
      //   display: "Template esterno4",
      //   type: TypeColumn.ExternalTemplate,
      //   externalTemplate: this.externalTemplate,
      //   styles: { flex: "0 0 10%" }
      // },
      // {
      //   key: "external_t5",
      //   display: "Template esterno5",
      //   type: TypeColumn.ExternalTemplate,
      //   externalTemplate: this.externalTemplate,
      //   styles: { flex: "0 0 10%" }
      // },
      // {
      //   key: "external_t6",
      //   display: "Template esterno6",
      //   type: TypeColumn.ExternalTemplate,
      //   externalTemplate: this.externalTemplate,
      //   styles: { flex: "0 0 10%" }
      // },
      // {
      //   key: "external_t7",
      //   display: "Template esterno7",
      //   type: TypeColumn.ExternalTemplate,
      //   externalTemplate: this.externalTemplate,
      //   styles: { flex: "0 0 10%" }
      // },
      // {
      //   key: "external_t8",
      //   display: "Template esterno8",
      //   type: TypeColumn.ExternalTemplate,
      //   externalTemplate: this.externalTemplate,
      //   styles: { flex: "0 0 10%" }
      // }
    ];
  }

  injectCustomButtons() {
    let button = new CustomButton();
    let button2 = new CustomButton();
    let button3 = new CustomButton();

    button3.icon = "fa fa-file-excel";
    button3.fontawesome = true;
    button3.customButtonFunction = () => { return console.log("Funziona3") }
    button3.order = 2;
    this.customButtons.push(button3);

    // button2.buttonText = "Chiudi";
    button2.icon = "alarm";
    button2.fontawesome = false;
    button2.customButtonFunction = () => { return console.log("Funziona2") }
    button2.order = 3;
    this.customButtons.push(button2);

    button.buttonText = "Aggiungi";
    button.icon = "add";
    button.fontawesome = false;
    button.customButtonFunction = () => { this.testDialog(); }
    button.order = 1;
    this.customButtons.push(button);
  }

  testDialog() {
    EqpAttachmentDialogService.Info("Funziona")
  }

  getLink(element) {
    return element.Link;
  }

  export() {
    console.log("Funzione");
  }

  buttonConfirm(event) {
    console.log(event);
  }

  buttonExit(event) {
    console.log(event);

  }

  testSearch(row) {
    if (row != null)
      return row.SerialNumber * 5
  }

  getColor(col, element) {
    let object;

    if (col.Name == "Andrea") {
      object = { color: "red", "font-weight": "700" };
      return object;
    }
  }

  getTooltipName(element) {
    if (!element || !element.fullName)
      return null;

    return element.fullName.name;
  }

  getTooltipSurname(element) {
    if (!element || !element.fullName)
      return null;

    return element.fullName.surname;
  }

  testHigh(event) {
    console.log(event);
    // this.eqpTable.highlight(null);
    // this.eqpTable.deselectHighlight();
  }

  changeTestValue() {
    this.DATA[1].nosi = !this.DATA[1].nosi;
  }

  reloadData() {
    this.DATA = this.DATA2;
    this.eqpTable.renderRows();
  }

  logCol(col) {
    console.log(col);
  }

  testSelection(event) {
    console.log(event);
  }

  page(event) {
    console.log(event);
  }

  CustomRowColorFunction(row) {
    if (row.fullName.name == "Andrea")
      return 'row-color'
    else
      return 'blue'
  }

  CustomCellColorFunction(row, col) {
    if (col.key == "name")
      return 'size'
    else
      return 'row-color'
  }

  CustomHeaderCellFunction(col) {
    if (col.key == "name")
      return 'row-color size'
    else
      return 'blue'
  }

  justSelected(event) {
    console.log(event)
  }
}
