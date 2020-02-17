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
  mxStackLayout
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
  private layout: mxgraph.mxGraphLayout;
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

    this.graph.collapseToPreferredSize = true;
    this.graph.constrainChildren = true;
    this.graph.cellsSelectable = true;
    this.graph.extendParentsOnAdd = true;
    this.graph.extendParents = true;
    this.graph.setDropEnabled(true);

    //this.graph.setResizeContainer(true);
    //this.graph.setEnabled(false);
    //var style = this.graph.getStylesheet().getDefaultVertexStyle();

    //this.layout = new mxCircleLayout(this.graph);
    this.layout = new mxStackLayout(this.graph, true, 50, 30, 30, true);
    try {
      const parent = this.graph.getDefaultParent();
      this.model.beginUpdate();

      this.items.forEach(item =>
        this.addVertix(item, parent, { x: 0, y: 0, width: 100, height: 60 })
      );
      this.reArrange();
    } finally {
      this.model.endUpdate();
    }
  }

  private addVertix(
    dataItem: DataItem,
    parent: any,
    geo: GeoData,
    isRelative?: boolean
  ): void {
    var vertix = this.graph.insertVertex(
      parent,
      null,
      dataItem.name,
      geo.x,
      geo.y,
      geo.width,
      geo.height,
      "rounded=1;",
      isRelative
    );

    if (dataItem.children) {
      for (var i = 0; i < dataItem.children.length; i++) {
        this.addVertix(dataItem.children[i], vertix, geo, true);
      }
    }
    //this.graph.updateCellSize(vertix, false);
    //this.graph.extendParent(parent);
  }

  private reArrange(): void {
    this.graph.getDefaultParent().children.forEach(cell => {
      if (cell.isVertex()) {
        this.layout.execute(cell);
      }
    });
    this.layout.execute(this.graph.getDefaultParent());
  }
}

interface DataItem {
  name: string;
  type: string;
  children?: DataItem[];
}

interface GeoData {
  x: number;
  y: number;
  width: number;
  height: number;
}
