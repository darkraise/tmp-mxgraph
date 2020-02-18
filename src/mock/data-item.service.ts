import { Injectable } from "@angular/core";

@Injectable()
export class DataItemService {
  data() {
    return [
      {
        name: "SYDCAT06",
        type: "SERVER",
        children: [
          {
            name: "UM",
            type: "APP",
            children: [
              {
                name: "PreQA",
                type: "ENV",
                children: [
                  { name: "Front-end", type: "INST" },
                  { name: "Authentication", type: "INST" },
                  { name: "Front-end Auto", type: "INST" },
                  { name: "Authentication Auto", type: "INST" }
                ]
              },
              {
                name: "QA",
                type: "ENV",
                children: [
                  { name: "Front-end", type: "INST" },
                  { name: "Authentication", type: "INST" }
                ]
              },
              {
                name: "Production",
                type: "ENV",
                children: [
                  { name: "Front-end Live", type: "INST" },
                  { name: "Authentication Live", type: "INST" }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "SYDCAT01",
        type: "SERVER",
        children: [
          {
            name: "Pivotal",
            type: "APP",
            children: [
              {
                name: "PreQA",
                type: "ENV",
                children: [
                  { name: "Front-end Daily", type: "INST" },
                  { name: "Front-end PreUAT", type: "INST" },
                  { name: "Front-end Auto", type: "INST" }
                ]
              },
              {
                name: "QA",
                type: "ENV",
                children: [
                  { name: "Front-end Training", type: "INST" },
                  { name: "Front-end UAT", type: "INST" },
                  { name: "Front-end Live Replica", type: "INST" }
                ]
              },
              {
                name: "Production",
                type: "ENV",
                children: [
                  { name: "Front-end Live", type: "INST" },
                  { name: "Front-end UAT", type: "INST" },
                  { name: "Front-end Training", type: "INST" }
                ]
              }
            ]
          }
        ]
      },
      {
        name: "SYDCAT05",
        type: "SERVER",
        children: [
          {
            name: "Policy",
            type: "APP",
            children: [
              {
                name: "PreQA",
                type: "ENV",
                children: [
                  { name: "Front-end Daily", type: "INST" },
                  { name: "Front-end PreUAT", type: "INST" }
                ]
              },
              {
                name: "QA",
                type: "ENV",
                children: [{ name: "Front-end UAT", type: "INST" }]
              },
              {
                name: "Production",
                type: "ENV",
                children: [{ name: "Front-end Live", type: "INST" }]
              }
            ]
          }
        ]
      }
      //   {
      //     name: "Server 4",
      //     type: "SERVER",
      //     children: [
      //       {
      //         name: "Attr 1",
      //         type: "INST",
      //         children: [
      //           { name: "c_v 1", type: "X" },
      //           { name: "c_v 2", type: "X" },
      //           { name: "c_v 3", type: "X" }
      //         ]
      //       },
      //       { name: "Attr 2", type: "INST" },
      //       { name: "Attr 3", type: "INST" }
      //     ]
      //   }
    ];
  }

  relation() {
    return [
      {
        source: "SYDCAT05_Policy_PreQA_Front-end Daily",
        targets: ["SYDCAT06_UM_PreQA_Authentication"]
      },
      {
        source: "SYDCAT01_Pivotal_PreQA_Front-end Daily",
        targets: [
          "SYDCAT06_UM_PreQA_Authentication",
          "SYDCAT06_UM_PreQA_Front-end"
        ]
      }
      // {
      //   source: "SYDCAT01_Pivotal_PreQA_Front-end Daily",
      //   targets: "SYDCAT06_UM_PreQA_Front-end"
      // }
    ];
  }

  cyData() {
    return {
      nodes: [
        { data: { id: "SYDCAT06", name: "SYDCAT06" } },
        { data: { id: "SYDCAT01", name: "SYDCAT01" } },
        { data: { id: "SYDCAT05", name: "SYDCAT05" } },
        { data: { id: "SYDCAT06_UM", parent: "SYDCAT06" }, name: "UM" },
        {
          data: {
            id: "SYDCAT06_UM_PreQA",
            parent: "SYDCAT06_UM",
            name: "PreQA"
          }
        },
        { data: { id: "SYDCAT06_UM_QA", parent: "SYDCAT06_UM", name: "QA" } },
        {
          data: {
            id: "SYDCAT06_UM_Production",
            parent: "SYDCAT06_UM",
            name: "Production"
          }
        }
      ],
      edges: []
      // edges: [
      //   { data: { id: "ad", source: "a", target: "d" } },
      //   { data: { id: "eb", source: "e", target: "b" } }
      // ]
    };
  }
}
