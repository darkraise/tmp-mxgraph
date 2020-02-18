import { DataItemService } from "src/mock/data-item.service";
import { ViewChild, Component, ElementRef, AfterViewInit } from "@angular/core";
import * as cytoscape from "cytoscape";
import { CytoscapeOptions, ElementDefinition, NodeSingular } from "cytoscape";
import { DataItem } from "../fetch-data/fetch-data.component";

@Component({
  selector: "app-data-vis",
  templateUrl: "./data-vis.component.html",
  styleUrls: ["./data-vis.component.css"],
  providers: [DataItemService]
})
export class DataVisComponent implements AfterViewInit {
  @ViewChild("graphContainer", { static: false }) container: ElementRef;

  constructor(private dataService: DataItemService) {}

  ngAfterViewInit(): void {
    var cy = cytoscape({
      container: document.getElementById("graphContainer"),
      elements: this.dataService.cyData(),
      style: [
        {
          selector: "node",
          css: {
            content: "data(name)",
            shape: "roundrectangle",
            "text-valign": "center",
            "text-halign": "center"
          }
        },
        {
          selector: ":parent",
          css: {
            "text-valign": "top",
            "text-halign": "center"
          }
        },
        {
          selector: "edge",
          css: {
            "curve-style": "bezier",
            "target-arrow-shape": "triangle"
          }
        }
      ],
      layout: { name: "grid" }
    });

    cy.fit();
    // var nodes = cy.nodes();
    // this.dataService.data().forEach(item => {

    // });
  }

  // private addNode(cy:cytoscape.Core, item: DataItem){
  //   var node =nodes.add(item.name);
  //   if(item.children){
  //     item.children.forEach(child=>{
  //       this.addNode()
  //     });
  //   }
  // }
}
