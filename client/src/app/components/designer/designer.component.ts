import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-designer',
  template: `
    <div class="h-screen px-2">
      <div class="relative grid grid-cols-9">
        <app-status-bar class="flex justify-between px-2 my-1 col-span-9"></app-status-bar>
        <app-actions-bar class="flex flex-wrap p-2 bg-gray-300 border-2 border-black col-span-9 box-border"></app-actions-bar>
        <app-microinteraction-selector class="h-full border-2 border-black col-span-1"></app-microinteraction-selector>
        <app-interaction-canvas class="relative col-span-6"></app-interaction-canvas>
        <app-interaction-options id="interaction-right-panel" class="h-full border-2 border-black col-span-2"></app-interaction-options>
        <app-violation-output class="h-full col-span-6"></app-violation-output>
        <app-robot-viewer class="col-span-3 bg-[#557d83] w-full h-full"></app-robot-viewer>
      </div>
    </div>
  `,
  styleUrls: []
})
export class DesignerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
