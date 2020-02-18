import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DataItemService } from "src/mock/data-item.service";
import { mxgraph, mxgraphFactory } from "mxgraph-factory";

const {
  mxGraph,
  mxGraphModel,
  mxHierarchicalLayout,
  mxFastOrganicLayout,
  mxCircleLayout,
  mxStackLayout,
  mxSwimlaneLayout,
  mxCompositeLayout,
  mxPartitionLayout,
  mxConstants,
  mxGeometry,
  mxCell,
  mxRectangle
} = mxgraphFactory({
  mxLoadResources: false,
  mxLoadStylesheets: false
});

@Component({
  selector: "app-fetch-data",
  templateUrl: "./fetch-data.component.html",
  styleUrls: ["./fetch-data.component.css"],
  providers: [DataItemService]
})
export class FetchDataComponent implements AfterViewInit {
  @ViewChild("graphContainer", {
    static: false
  })
  graphContainer: ElementRef;

  private model: mxgraph.mxGraphModel;
  private graph: mxgraph.mxGraph;
  private verticles: { [key: string]: mxgraph.mxCell } = {};

  public items: DataItem[];

  constructor(
    http: HttpClient,
    @Inject("BASE_URL") baseUrl: string,
    private dataService: DataItemService
  ) {
    // http.get<DataItem[]>(baseUrl + 'DataItem').subscribe(result => {
    //   this.items = result;
    // }, error => console.error(error));
    this.items = this.dataService.data();
  }

  ngAfterViewInit(): void {
    this.model = new mxGraphModel();
    this.graph = new mxGraph(this.graphContainer.nativeElement, this.model);
    this.graph.convertValueToString = function(cell) {
      if (cell.value) {
        var item = cell.value as DataItem;
        return item ? item.name : `${cell.value}`;
      }
      return "";
    };

    var grandLayout = new mxStackLayout(this.graph, true, 30, 8, 8, true);

    try {
      const parent = this.graph.getDefaultParent();
      this.graph.getModel().beginUpdate();

      this.items.forEach(item =>
        this.addVertix(item, parent, new mxGeometry(0, 0, 100, 60))
      );
      this.populateRelation();
      this.graph.setDropEnabled(true);
      this.reArrange(parent, grandLayout);
    } finally {
      this.graph.getModel().endUpdate();
    }
  }

  private getItemKey(vertix: mxgraph.mxCell): string {
    if (vertix.value === undefined) {
      return "";
    } else if (vertix.parent.value === undefined) {
      return vertix.value.name;
    } else return `${this.getItemKey(vertix.parent)}_${vertix.value.name}`;
  }

  private addVertix(
    dataItem: DataItem,
    parent: mxgraph.mxCell,
    geo: mxgraph.mxGeometry
  ): void {
    var cell = this.graph.insertVertex(
      parent,
      null,
      dataItem,
      geo.x,
      geo.y,
      geo.width,
      geo.height,
      "rounded=1;fontStyle=1;align=center;verticalAlign=top;whiteSpace=wrap;"
    );
    this.verticles[this.getItemKey(cell)] = cell;
    if (dataItem.children) {
      for (var i = 0; i < dataItem.children.length; i++) {
        this.addVertix(dataItem.children[i], cell, geo);
      }
    } else {
      cell.style = "html=1;rounded=1;fontStyle=1;align=center;whiteSpace=wrap;";
    }
  }

  private populateRelation(): void {
    debugger;
    this.dataService.relation().forEach(rel => {
      if (this.verticles[rel.source]) {
        rel.targets.forEach(target => {
          if (this.verticles[target]) {
            this.graph.insertEdge(
              this.graph.getDefaultParent(),
              null,
              null,
              this.verticles[rel.source],
              this.verticles[target]
            );
          }
        });
      }
    });
  }
  private reArrange(
    parentCell: mxgraph.mxCell,
    layout: mxgraph.mxGraphLayout
  ): void {
    var isHorizontal: boolean = true;
    if (parentCell.children) {
      const stackLayout = new mxStackLayout(this.graph, true, 20, 8, 30, false);
      stackLayout.fill = true;
      stackLayout.resizeParent = true;
      stackLayout.resizeParentMax = true;

      //stackLayout.
      parentCell.children.forEach(cell => {
        if (cell.isVertex() && cell.children) {
          this.reArrange(cell, stackLayout);
        }
      });
      if (
        parentCell.value &&
        parentCell.value.type == "ENV" &&
        (layout as mxgraph.mxStackLayout) !== undefined
      ) {
        (layout as mxgraph.mxStackLayout).horizontal = false;
        isHorizontal = false;
      }
      layout.execute(parentCell);
      this.resizeVertex(parentCell, isHorizontal);
    }
  }

  private resizeVertex(cell: mxgraph.mxCell, isHorizontal: boolean): void {
    if (cell.geometry == null) {
      return;
    }

    var childGeo = cell.children
      .map(c => {
        return c.geometry;
      })
      .reduce((sumGeo, currentGeo) => {
        return new mxGeometry(
          sumGeo.x,
          sumGeo.y,
          isHorizontal ? sumGeo.width + 20 + currentGeo.width : sumGeo.width,
          isHorizontal ? sumGeo.height : sumGeo.height + 20 + currentGeo.height
        );
      });
    var g = cell.geometry.clone();
    g.width = childGeo.width + 50;
    g.height = childGeo.height + 50;
    this.graph.cellsResized([cell], [g]);
  }
}

export interface DataItem {
  name: string;
  type: string;
  children?: DataItem[];
}

interface Relation {
  item1: string;
  item2: string;
}
