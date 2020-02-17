import { Injectable } from "@angular/core";

@Injectable()
export class DataItemService {
  data() {
    return [
      {
        name: "Server 1",
        type: "SERVER",
        children: [
          { name: "ENV 1", type: "ENV" },
          { name: "ENV 2", type: "ENV" }
        ]
      },
      { name: "Server 2", type: "SERVER" },
      { name: "Server 3", type: "SERVER" },
      { name: "Server 4", type: "SERVER" }
    ];
  }
}
