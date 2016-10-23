goog.provide('canvasEvents')
goog.require('initCanvas')
goog.require('ui')
goog.require('states')
goog.require('pageTemplates')

console.log("Enter canvasEvents.js")

compound_group_num = 0;
source_node = null;
held_node = null;

fight_objects = eval([{"data":{"name":"B","source":"05c03ecd-9220-41df-9256-577a0417a5ac","target":"4c44d602-4d7b-4a48-839e-c1d548820275","text":"","conditions":[],"outcomes":[],"id":"1a9d81b0-c02c-4391-9b5e-29115c0cee20"},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"pageedge"},{"data":{"id":"Emptyparent101","name":"Fight"},"position":{"x":384.75,"y":571},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"expanded named"},{"data":{"name":"Start Fight","pagestyle":"width: 1005.45px; flex: 0 0 800px; height: 805.455px; border: 3px solid black; transform: scale(0.702865);","outputcontainer":"","debugcontainer":"","imgcontainers":[{"name":1,"html":"<div class=\"img-container drag-element\" style=\"position: absolute; transform: translate(344.709px, 115.717px); z-index: 60;\" data-x=\"344.70928920991156\" data-y=\"115.71697631715011\"><img class=\"editdiv resize-element\" src=\"http://images.clipartpanda.com/crab-clip-art-crab7.png\"></div>"}],"vidcontainers":[],"textcontainers":[{"name":1,"html":"<div class=\"text-container drag-element\" style=\"position: absolute; transform: translate(344.709px, 357.585px); z-index: 61;\" data-x=\"344.7092892099116\" data-y=\"357.5848995364519\"><div class=\"editdiv resize-element\" contenteditable=\"true\">A Giant Enemy Crab Appeared!</div></div>"}],"decisioncontainers":[{"name":"A","html":"<div class=\"decision-container drag-element\" style=\"position: absolute; z-index: 62; transform: translate(387.801px, 649.863px);\" data-x=\"387.80105837068334\" data-y=\"649.8625477661149\" edgename=\"A\"><div class=\"editdec decisionbutton drag-element resize-element\" contenteditable=\"true\">Let's Fight!</div></div>"}],"specialbuttons":[],"events":[],"eventspane":"<span class=\"eventspanetitle eventname\" style=\"text-align:center; font-size: 16px;\">Asset</span><span class=\"eventspanetitle eventtype\" style=\"text-align:center; font-size: 16px;\">Event</span><span class=\"eventspanetitle eventtrigger\" style=\"text-align:center; font-size: 16px;\">Time</span>","id":"72e94087-01f9-477d-941c-3fb29652b431","fakeattribute":1,"parent":"Emptyparent101"},"position":{"x":383.5,"y":190.75},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"page start named"},{"data":{"name":"Escape","pagestyle":"width: 1005.45px; flex: 0 0 800px; height: 805.455px; border: 3px solid black; transform: scale(0.599818);","outputcontainer":"","debugcontainer":"<div class=\"output-container maker drag-element\" style=\"position: absolute; transform: translate(702.568px, 354.988px); z-index: 64;\" data-x=\"702.5677442507723\" data-y=\"354.9882462212463\"><div class=\"editdiv resize-element\" contenteditable=\"false\"></div></div>","imgcontainers":[],"vidcontainers":[],"textcontainers":[{"name":1,"html":"<div class=\"text-container drag-element\" style=\"position: absolute; transform: translate(344.709px, 357.585px); z-index: 61;\" data-x=\"344.7092892099116\" data-y=\"357.5848995364519\"><div class=\"editdiv resize-element\" contenteditable=\"true\">You Escaped!</div></div>"}],"decisioncontainers":[],"specialbuttons":[],"events":[],"eventspane":"<span class=\"eventspanetitle eventname\" style=\"text-align:center; font-size: 16px;\">Asset</span><span class=\"eventspanetitle eventtype\" style=\"text-align:center; font-size: 16px;\">Event</span><span class=\"eventspanetitle eventtrigger\" style=\"text-align:center; font-size: 16px;\">Time</span>","id":"cb838210-03f6-48a8-ba3b-a60dcc723552","parent":"Emptyparent101"},"position":{"x":575.25,"y":763},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"page named leaf"},{"data":{"name":"Victory","pagestyle":"width: 1005.45px; flex: 0 0 800px; height: 805.455px; border: 3px solid black; transform: scale(0.702865);","outputcontainer":"","debugcontainer":"","imgcontainers":[{"name":1,"html":"<div class=\"img-container drag-element\" style=\"position: absolute; transform: translate(344.711px, 115.811px); z-index: 63;\" data-x=\"344.7105911861863\" data-y=\"115.81083826645181\"><img class=\"editdiv resize-element\" src=\"http://images.clipartpanda.com/treasure-chest-clipart-35f3eb63b7d625267946b54fe3c78a05.jpg\"></div>"}],"vidcontainers":[],"textcontainers":[{"name":1,"html":"<div class=\"text-container drag-element\" style=\"position: absolute; transform: translate(344.709px, 357.585px); z-index: 61;\" data-x=\"344.7092892099116\" data-y=\"357.5848995364519\"><div class=\"editdiv resize-element\" contenteditable=\"true\">You won!</div></div>"}],"decisioncontainers":[],"specialbuttons":[],"events":[],"eventspane":"<span class=\"eventspanetitle eventname\" style=\"text-align:center; font-size: 16px;\">Asset</span><span class=\"eventspanetitle eventtype\" style=\"text-align:center; font-size: 16px;\">Event</span><span class=\"eventspanetitle eventtrigger\" style=\"text-align:center; font-size: 16px;\">Time</span>","id":"b3d11854-f234-48be-998b-111294371ffc","parent":"Emptyparent101"},"position":{"x":191.75,"y":763},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"page named leaf"},{"data":{"name":"Defeat","pagestyle":"width: 1005.45px; flex: 0 0 800px; height: 805.455px; border: 3px solid black; transform: scale(0.702865); background-color: rgb(0, 0, 0);","outputcontainer":"","debugcontainer":"","imgcontainers":[{"name":1,"html":"<div class=\"img-container drag-element\" style=\"position: absolute; transform: translate(344.711px, 101.591px); z-index: 63;\" data-x=\"344.7105911861863\" data-y=\"101.59138216513267\"><img class=\"editdiv resize-element\" src=\"http://cliparting.com/wp-content/uploads/2016/07/Skull-clipart.png\" style=\"border-radius: 1000px;\"></div>"}],"vidcontainers":[],"textcontainers":[{"name":1,"html":"<div class=\"text-container drag-element\" style=\"position: absolute; transform: translate(344.709px, 357.585px); z-index: 61;\" data-x=\"344.7092892099116\" data-y=\"357.5848995364519\"><div class=\"editdiv resize-element\" contenteditable=\"true\" style=\"text-align: center; background-color: rgb(0, 0, 0); color: rgb(255, 255, 255);\">You were defeated...</div></div>"}],"decisioncontainers":[],"specialbuttons":[],"events":[],"eventspane":"<span class=\"eventspanetitle eventname\" style=\"text-align:center; font-size: 16px;\">Asset</span><span class=\"eventspanetitle eventtype\" style=\"text-align:center; font-size: 16px;\">Event</span><span class=\"eventspanetitle eventtrigger\" style=\"text-align:center; font-size: 16px;\">Time</span>","id":"9f687f31-c97c-4cd7-93fa-7a0b5171d073","parent":"Emptyparent101"},"position":{"x":383.5,"y":953.75},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"page named leaf"},{"data":{"name":"Fight","priorityList":["0863aed6-479e-4000-8bac-4f877d51c61e","08b362c4-77c9-4abb-92f3-895e0490b6aa"],"defaultFailEdge":"0863aed6-479e-4000-8bac-4f877d51c61e","id":"6c17a410-3f39-4587-a1ab-288234a8b1f5","parent":"Emptyparent101"},"position":{"x":255.66666666666669,"y":572.25},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"control named"},{"data":{"name":"Choose Action","pagestyle":"width: 1005.45px; flex: 0 0 800px; height: 805.455px; border: 3px solid black; transform: scale(0.702865);","outputcontainer":"<div class=\"output-container player drag-element\" style=\"position: absolute; transform: translate(344.85px, 357.58px); z-index: 67;\" data-x=\"344.84964225233\" data-y=\"357.57970784884424\"><div class=\"editdiv resize-element\" contenteditable=\"false\"></div></div>","debugcontainer":"<div class=\"output-container maker drag-element\" style=\"position: absolute; transform: translate(702.568px, 357.553px); z-index: 69;\" data-x=\"702.5677973376979\" data-y=\"357.5528588835592\"><div class=\"editdiv resize-element\" contenteditable=\"false\"></div></div>","imgcontainers":[{"name":1,"html":"<div class=\"img-container drag-element\" style=\"position: absolute; transform: translate(344.709px, 115.717px); z-index: 60;\" data-x=\"344.70928920991156\" data-y=\"115.71697631715011\"><img class=\"editdiv resize-element\" src=\"http://images.clipartpanda.com/crab-clip-art-crab7.png\"></div>"}],"vidcontainers":[],"textcontainers":[],"decisioncontainers":[{"name":"A","html":"<div class=\"decision-container drag-element\" style=\"position: absolute; z-index: 63; transform: translate(131.802px, 706.529px);\" data-x=\"131.80214330772966\" data-y=\"706.5293455142221\" edgename=\"A\"><div class=\"editdec decisionbutton drag-element resize-element\" contenteditable=\"true\">Attack</div></div>"},{"name":"B","html":"<div class=\"decision-container drag-element\" style=\"position: absolute; z-index: 64; transform: translate(643.76px, 706.546px);\" data-x=\"643.7600461612125\" data-y=\"706.5462458562452\" edgename=\"B\"><div class=\"editdec decisionbutton drag-element resize-element\" contenteditable=\"true\">Try to escape!</div></div>"}],"specialbuttons":[],"events":[],"eventspane":"<span class=\"eventspanetitle eventname\" style=\"text-align:center; font-size: 16px;\">Asset</span><span class=\"eventspanetitle eventtype\" style=\"text-align:center; font-size: 16px;\">Event</span><span class=\"eventspanetitle eventtrigger\" style=\"text-align:center; font-size: 16px;\">Time</span>","id":"05c03ecd-9220-41df-9256-577a0417a5ac","parent":"Emptyparent101"},"position":{"x":383.5,"y":381.5},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"page named"},{"data":{"name":"Run","priorityList":["b4703538-ed20-486d-96fd-3dcb3c009402","a11d3f6e-d220-49db-bbfa-a91a7f68133f"],"defaultFailEdge":"b4703538-ed20-486d-96fd-3dcb3c009402","id":"4c44d602-4d7b-4a48-839e-c1d548820275","parent":"Emptyparent101"},"position":{"x":511.3333333333333,"y":572.25},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"control named"},{"data":{"name":"A","source":"72e94087-01f9-477d-941c-3fb29652b431","target":"05c03ecd-9220-41df-9256-577a0417a5ac","text":"","conditions":[],"outcomes":[],"id":"2f7e162a-63ad-4aec-ae69-5f07815c1c9f"},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"pageedge"},{"data":{"name":"A","source":"4c44d602-4d7b-4a48-839e-c1d548820275","target":"cb838210-03f6-48a8-ba3b-a60dcc723552","text":"","conditions":[],"outcomes":[],"id":"a11d3f6e-d220-49db-bbfa-a91a7f68133f"},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"success-edge controledge"},{"data":{"name":"A","source":"6c17a410-3f39-4587-a1ab-288234a8b1f5","target":"b3d11854-f234-48be-998b-111294371ffc","text":"","conditions":[{"edge":"0863aed6-479e-4000-8bac-4f877d51c61e","id":0,"html":"<div class=\"row\" type=\"1\"><div class=\"col s1\"><div id=\"exCondition_0863aed6-479e-4000-8bac-4f877d51c61e_0_settings\" class=\"condition-settings-context-menu condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2\"><div id=\"exCondition_0863aed6-479e-4000-8bac-4f877d51c61e_0_attButton_s1_1\" class=\"condition-context-menu game-attributes attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Enemies > Crab > Health\" path=\"ENEMIES_0BPX_ABRt\" data-tooltip-id=\"d6273218-1881-b42a-02b9-f524e592a390\"><p class=\"truncate\">Health</p></div></div><div id=\"exCondition_0863aed6-479e-4000-8bac-4f877d51c61e_0_compMenu_s1\" class=\"col s1 comparison-context-menu comps comparison-button\">&lt;=</div><div class=\"input-field col s2\"><input placeholder=\"Enter Value\" id=\"newCondition_0_specValue_s1_2_inputField\" type=\"number\" class=\"input-field autosetvalue condition-context-menu-right game-attributes numbers \" value=\"0\"><label for=\"newCondition_0_specValue_s1_2_inputField\" class=\"active\">Enter Value</label></div></div><div class=\"divider\"></div>"}],"outcomes":[],"id":"0863aed6-479e-4000-8bac-4f877d51c61e"},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"success-edge controledge"},{"data":{"name":"A","source":"5b183bd6-f363-45d3-9fe8-30a13f7ac7ca","target":"05c03ecd-9220-41df-9256-577a0417a5ac","text":"","conditions":[],"outcomes":[],"id":"1322b9e5-5d57-4989-9b6b-67c1436e8449"},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"fail-edge controledge"},{"data":{"name":"B","source":"6c17a410-3f39-4587-a1ab-288234a8b1f5","target":"5b183bd6-f363-45d3-9fe8-30a13f7ac7ca","text":"","conditions":[],"outcomes":[{"edge":"08b362c4-77c9-4abb-92f3-895e0490b6aa","id":0,"html":"<div class=\"row\" type=\"Text-Attribute-Text\"><div class=\"col s1\"><div id=\"exOutcome_08b362c4-77c9-4abb-92f3-895e0490b6aa_0_settings\" class=\"condition-settings-context-menu outcome condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2 truncate\"><div id=\"exOutcome_08b362c4-77c9-4abb-92f3-895e0490b6aa_0_text_1\" onclick=\"editTextModal(this.id)\" class=\"attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Your health is now\" data-tooltip-id=\"094cb64c-092a-d5b5-ca22-e63c68a51461\"><p class=\"truncate\">\"Your health is now\"</p></div></div><div class=\"col s2\"><div id=\"exOutcome_08b362c4-77c9-4abb-92f3-895e0490b6aa_0_attButton_1\" class=\"condition-context-menu game-attributes attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Character > Health\" path=\"PLAYER_GWed\" data-tooltip-id=\"42c9bcae-4328-75d0-ce87-cb02d692aa51\"><p class=\"truncate\">Health</p></div></div><div class=\"col s2 truncate\"><div id=\"newOutcome_0_text_2\" onclick=\"editTextModal(this.id)\" class=\"attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"\" data-tooltip-id=\"0b498dc7-6eee-cc04-191f-dc01c9f482ae\"><p class=\"truncate\">Click to add text</p></div></div></div><div class=\"divider\"></div>"},{"edge":"08b362c4-77c9-4abb-92f3-895e0490b6aa","id":1,"html":"<div class=\"row\" type=\"Text-Attribute-Text\"><div class=\"col s1\"><div id=\"exOutcome_08b362c4-77c9-4abb-92f3-895e0490b6aa_1_settings\" class=\"condition-settings-context-menu outcome condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2 truncate\"><div id=\"exOutcome_08b362c4-77c9-4abb-92f3-895e0490b6aa_1_text_1\" onclick=\"editTextModal(this.id)\" class=\"attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Enemy crab health is now \" data-tooltip-id=\"2afcb297-b569-d75b-66a3-7d1dd8fdf585\"><p class=\"truncate\">\"Enemy crab health is now \"</p></div></div><div class=\"col s2\"><div id=\"exOutcome_08b362c4-77c9-4abb-92f3-895e0490b6aa_1_attButton_1\" class=\"condition-context-menu game-attributes numbers attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Enemies > Crab > Health\" path=\"ENEMIES_0BPX_ABRt\" data-tooltip-id=\"7c3005bf-afe0-58fb-0a6b-bc028c7f0592\">Health</div></div><div class=\"col s2 truncate\"><div id=\"newOutcome_1_text_2\" onclick=\"editTextModal(this.id)\" class=\"attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"\" data-tooltip-id=\"510c9a5b-8683-4c8e-e247-9898cfa79adb\"><p class=\"truncate\">Click to add text</p></div></div></div><div class=\"divider\"></div>"}],"id":"08b362c4-77c9-4abb-92f3-895e0490b6aa"},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"fail-edge controledge"},{"data":{"name":"B","source":"5b183bd6-f363-45d3-9fe8-30a13f7ac7ca","target":"9f687f31-c97c-4cd7-93fa-7a0b5171d073","text":"","conditions":[{"edge":"6ce3a0d2-0ff5-4a80-85ca-5037cf2bd914","id":0,"html":"<div class=\"row\" type=\"1\"><div class=\"col s1\"><div id=\"exCondition_6ce3a0d2-0ff5-4a80-85ca-5037cf2bd914_0_settings\" class=\"condition-settings-context-menu condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2\"><div id=\"exCondition_6ce3a0d2-0ff5-4a80-85ca-5037cf2bd914_0_attButton_s1_1\" class=\"condition-context-menu game-attributes attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Character > Health\" path=\"PLAYER_GWed\" data-tooltip-id=\"cc6b87d8-2619-548d-e1bd-040ff25e705f\"><p class=\"truncate\">Health</p></div></div><div id=\"exCondition_6ce3a0d2-0ff5-4a80-85ca-5037cf2bd914_0_compMenu_s1\" class=\"col s1 comparison-context-menu comps comparison-button\">&lt;=</div><div class=\"input-field col s2\"><input placeholder=\"Enter Value\" id=\"newCondition_0_specValue_s1_2_inputField\" type=\"number\" class=\"input-field autosetvalue condition-context-menu-right game-attributes numbers \" value=\"0\"><label for=\"newCondition_0_specValue_s1_2_inputField\" class=\"active\">Enter Value</label></div></div><div class=\"divider\"></div>"}],"outcomes":[],"id":"6ce3a0d2-0ff5-4a80-85ca-5037cf2bd914"},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"success-edge controledge"},{"data":{"name":"A","source":"05c03ecd-9220-41df-9256-577a0417a5ac","target":"6c17a410-3f39-4587-a1ab-288234a8b1f5","text":"","conditions":[],"outcomes":[{"edge":"23443e44-1f59-4524-8884-75e4df25d2e3","id":0,"html":"<div class=\"row\" type=\"Attribute Modification\"><div class=\"col s1\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_0_settings\" class=\"condition-settings-context-menu outcome condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_0_attButton_1\" class=\"condition-context-menu game-attributes attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Character > Health\" path=\"PLAYER_GWed\" data-tooltip-id=\"278e57a1-c7bc-5043-ddd5-ecfcbf91d5d7\"><p class=\"truncate\">Health</p></div></div><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_0_compMenu\" class=\"col s1 comparison-context-menu mods equals comparison-button\">-</div><div class=\"col s2\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_0_attButton_2\" class=\"condition-context-menu game-attributes numbers attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Enemies > Crab > Damage\" path=\"ENEMIES_0BPX_wIat\" data-tooltip-id=\"7ebf8a6d-7d50-190f-d396-21361cbab0ce\"><p class=\"truncate\">Damage</p></div></div></div><div class=\"divider\"></div>"},{"edge":"23443e44-1f59-4524-8884-75e4df25d2e3","id":1,"html":"<div class=\"row\" type=\"Attribute Modification\"><div class=\"col s1\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_1_settings\" class=\"condition-settings-context-menu outcome condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_1_attButton_1\" class=\"condition-context-menu game-attributes attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Character > Health\" path=\"PLAYER_GWed\" data-tooltip-id=\"73745549-8840-facb-215f-8af252ed43b3\"><p class=\"truncate\">Health</p></div></div><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_1_compMenu\" class=\"col s1 comparison-context-menu mods equals comparison-button\">-</div><div class=\"col s2\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_1_randValue_2\" class=\"random attribute-button tooltipped condition-context-menu game-attributes numbers\" max=\"5\" min=\"0\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Minimum: 0<br>Maximum: 5\" data-tooltip-id=\"7a132424-3ab8-8ee9-731a-ad6a0503a161\">Random Number</div></div></div><div class=\"divider\"></div>"},{"edge":"23443e44-1f59-4524-8884-75e4df25d2e3","id":2,"html":"<div class=\"row\" type=\"Attribute Modification\"><div class=\"col s1\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_2_settings\" class=\"condition-settings-context-menu outcome condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_2_attButton_1\" class=\"condition-context-menu game-attributes attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Enemies > Crab > Health\" path=\"ENEMIES_0BPX_ABRt\" data-tooltip-id=\"a7c022c4-ad6b-1363-8077-eb80f0e3218e\"><p class=\"truncate\">Health</p></div></div><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_2_compMenu\" class=\"col s1 comparison-context-menu mods equals comparison-button\">-</div><div class=\"col s2\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_2_attButton_2\" class=\"condition-context-menu game-attributes numbers attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Character > Damage\" path=\"PLAYER_6a4t\" data-tooltip-id=\"b36c9206-e78d-51a2-ff26-17556887f9d6\"><p class=\"truncate\">Damage</p></div></div></div><div class=\"divider\"></div>"},{"edge":"23443e44-1f59-4524-8884-75e4df25d2e3","id":3,"html":"<div class=\"row\" type=\"Attribute Modification\"><div class=\"col s1\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_3_settings\" class=\"condition-settings-context-menu outcome condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_3_attButton_1\" class=\"condition-context-menu game-attributes attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Enemies > Crab > Health\" path=\"ENEMIES_0BPX_ABRt\" data-tooltip-id=\"6544f898-e28d-cfab-a36d-8de0036b25d8\"><p class=\"truncate\">Health</p></div></div><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_3_compMenu\" class=\"col s1 comparison-context-menu mods equals comparison-button\">-</div><div class=\"col s2\"><div id=\"exOutcome_23443e44-1f59-4524-8884-75e4df25d2e3_3_randValue_2\" class=\"random attribute-button tooltipped condition-context-menu game-attributes numbers\" max=\"5\" min=\"0\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Minimum: 0<br>Maximum: 5\" data-tooltip-id=\"304ecf01-f52d-7af7-ab20-3301885235b9\">Random Number</div></div></div><div class=\"divider\"></div>"}],"id":"23443e44-1f59-4524-8884-75e4df25d2e3"},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"pageedge"},{"data":{"name":"B","source":"4c44d602-4d7b-4a48-839e-c1d548820275","target":"5b183bd6-f363-45d3-9fe8-30a13f7ac7ca","text":"","conditions":[{"edge":"b4703538-ed20-486d-96fd-3dcb3c009402","id":0,"html":"<div class=\"row\" type=\"1\"><div class=\"col s1\"><div id=\"exCondition_b4703538-ed20-486d-96fd-3dcb3c009402_0_settings\" class=\"condition-settings-context-menu condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2\"><div id=\"newCondition_0_randButton\" class=\"random attribute-button tooltipped condition-context-menu\" max=\"100\" min=\"0\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Minimum: 0<br>Maximum: 100\" data-tooltip-id=\"de27843c-b60f-068c-f5d1-7d83607b3d7f\">Random Number</div></div><div id=\"exCondition_b4703538-ed20-486d-96fd-3dcb3c009402_0_compMenu_s1\" class=\"col s1 comparison-context-menu comps comparison-button\">&lt;</div><div class=\"input-field col s2\"><input placeholder=\"Enter Number\" id=\"newCondition_0_inputField_inputField\" type=\"number\" class=\"input-field autosetvalue  \" value=\"95\"><label for=\"newCondition_0_inputField_inputField\" class=\"active\">Enter Number</label></div></div><div class=\"divider\"></div>"}],"outcomes":[{"edge":"b4703538-ed20-486d-96fd-3dcb3c009402","id":0,"html":"<div class=\"row\" type=\"Text\"><div class=\"col s1\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_0_settings\" class=\"condition-settings-context-menu outcome condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2 truncate\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_0_text_1\" onclick=\"editTextModal(this.id)\" class=\"attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"You tried to run, but the crab was too fast!\" data-tooltip-id=\"d9ca4fdd-177f-e866-8ca2-6afd8654375a\"><p class=\"truncate\">\"You tried to run, but the crab was too fast!\"</p></div></div></div><div class=\"divider\"></div>"},{"edge":"b4703538-ed20-486d-96fd-3dcb3c009402","id":1,"html":"<div class=\"row\" type=\"Text-Attribute-Text\"><div class=\"col s1\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_1_settings\" class=\"condition-settings-context-menu outcome condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2 truncate\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_1_text_1\" onclick=\"editTextModal(this.id)\" class=\"attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Enraged he strikes you for \" data-tooltip-id=\"a8e9a53a-789f-045b-2837-86b438faab92\"><p class=\"truncate\">\"Enraged he strikes you for \"</p></div></div><div class=\"col s2\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_1_attButton_1\" class=\"condition-context-menu game-attributes attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Enemies > Crab > Damage\" path=\"ENEMIES_0BPX_wIat\" data-tooltip-id=\"6bb06c42-2200-4c58-479f-75d6c4bb5dae\"><p class=\"truncate\">Damage</p></div></div><div class=\"col s2 truncate\"><div id=\"newOutcome_1_text_2\" onclick=\"editTextModal(this.id)\" class=\"attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\" damage!\" data-tooltip-id=\"5c11d775-329d-d203-be6c-3f1c96d34929\"><p class=\"truncate\">\" damage!\"</p></div></div></div><div class=\"divider\"></div>"},{"edge":"b4703538-ed20-486d-96fd-3dcb3c009402","id":2,"html":"<div class=\"row\" type=\"Attribute Modification\"><div class=\"col s1\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_2_settings\" class=\"condition-settings-context-menu outcome condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_2_attButton_1\" class=\"condition-context-menu game-attributes attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Character > Health\" path=\"PLAYER_GWed\" data-tooltip-id=\"749181b8-a1f3-d199-f45f-fd0cab5d4e42\"><p class=\"truncate\">Health</p></div></div><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_2_compMenu\" class=\"col s1 comparison-context-menu mods equals comparison-button\">-</div><div class=\"col s2\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_2_attButton_2\" class=\"condition-context-menu game-attributes numbers attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Enemies > Crab > Damage\" path=\"ENEMIES_0BPX_wIat\" data-tooltip-id=\"52c8605e-f1ed-9865-5d22-fefe7e6da509\"><p class=\"truncate\">Damage</p></div></div></div><div class=\"divider\"></div>"},{"edge":"b4703538-ed20-486d-96fd-3dcb3c009402","id":3,"html":"<div class=\"row\" type=\"Text-Attribute-Text\"><div class=\"col s1\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_3_settings\" class=\"condition-settings-context-menu outcome condition-settings-button\"><a class=\"btn-floating waves-effect waves-light gray\"><i class=\"material-icons\">settings</i></a></div></div><div class=\"col s2 truncate\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_3_text_1\" onclick=\"editTextModal(this.id)\" class=\"attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Your health is now: \" data-tooltip-id=\"837fded0-bc7d-cf0a-7609-b3bfa2c75edb\"><p class=\"truncate\">\"Your health is now: \"</p></div></div><div class=\"col s2\"><div id=\"exOutcome_b4703538-ed20-486d-96fd-3dcb3c009402_3_attButton_1\" class=\"condition-context-menu game-attributes attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"Character > Health\" path=\"PLAYER_GWed\" data-tooltip-id=\"2c5ae56a-2878-d5f1-bfe0-d74dbf14204d\"><p class=\"truncate\">Health</p></div></div><div class=\"col s2 truncate\"><div id=\"newOutcome_4_text_2\" onclick=\"editTextModal(this.id)\" class=\"attribute-button tooltipped\" data-html=\"true\" data-position=\"bottom\" data-delay=\"50\" data-tooltip=\"\" data-tooltip-id=\"e05dcc1f-f541-12e3-a380-014536a8f23d\"><p class=\"truncate\">Click to add text</p></div></div></div><div class=\"divider\"></div>"}],"id":"b4703538-ed20-486d-96fd-3dcb3c009402"},"position":{},"group":"edges","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"controledge fail-edge"},{"data":{"name":"Check Health","priorityList":["6ce3a0d2-0ff5-4a80-85ca-5037cf2bd914","1322b9e5-5d57-4989-9b6b-67c1436e8449"],"defaultFailEdge":"1322b9e5-5d57-4989-9b6b-67c1436e8449","id":"5b183bd6-f363-45d3-9fe8-30a13f7ac7ca","parent":"Emptyparent101"},"position":{"x":383.5,"y":763},"group":"nodes","removed":false,"selected":false,"selectable":true,"locked":false,"grabbable":true,"classes":"control named"}])
fight_attributes = eval({"PLAYER":{"GWed":{"name":"Health","is_leaf":true,"value":"100","initValue":"100","parentPath":"PLAYER","id":"GWed","description":"No description provided","level":null,"path":"PLAYER_GWed","childrenArray":[]},"6a4t":{"name":"Damage","is_leaf":true,"value":"10","initValue":"10","parentPath":"PLAYER","id":"6a4t","description":"No description provided","level":null,"path":"PLAYER_6a4t","childrenArray":[]}},"ENEMIES":{"0BPX":{"name":"Crab","is_leaf":false,"parentPath":"ENEMIES","id":"0BPX","level":null,"path":"ENEMIES_0BPX","childrenArray":["ABRt","wIat"],"ABRt":{"name":"Health","is_leaf":true,"value":"50","initValue":"50","parentPath":"ENEMIES_0BPX","id":"ABRt","description":"No description provided","level":null,"path":"ENEMIES_0BPX_ABRt","childrenArray":[]},"wIat":{"name":"Damage","is_leaf":true,"value":"10","initValue":"10","parentPath":"ENEMIES_0BPX","id":"wIat","description":"No description provided","level":null,"path":"ENEMIES_0BPX_wIat","childrenArray":[]}}}})
//****** dropping into compound nodes *******
var updatePlayerChildren = true;
var updateEnemiesChildren = true;
cy.on('tapstart', 'node', function(event)
{
	//sometimes tapend fires on a different element than the one we dragged due to z-axis issues.
	held_node = event.cyTarget;
});

//dragging nodes into parents
cy.on('tapend', function(event)
{
	if (held_node == null)
		return;

	console.log("Check for dropping into parents:" , cy.$(':parent').length)
	var group = cy.$(':parent:orphan.expanded')
	var mouse = event.cyRenderedPosition;

	testobj = {"added": false, "parent": "none"};

	//check if we placed it into a parent
	checkCompoundBounds(group, mouse, testobj);

	console.log("Finished: ", testobj)
	if (testobj.added)
	{
		if (testobj.parent !== held_node.parent().id())
		{
			console.log("Move ", held_node.id(), " into ", testobj.parent);
			//If we've selected a bunch of nodes we probably want to move them all into the group, not just the held node.
			if (cy.$(':selected').length > 1)
				held_node = held_node.union('node:selected:orphan');

			held_node.move({
			 	parent: testobj.parent,
			});
		}
	}
	held_node = null

});


//****** compound node functions *********

cy.on('taphold', ':parent', function(event)
{
	//prevent dragging/repositioning parent node until it's done expanding
	if(parent.children().animated())
		return;
});

//colapse/expand compound nodes
cy.on('tap', ':parent:selected', function(event)
{
	cy.$(':selected').unselect();
	if (this.hasClass('collapsed'))
	{
		expand(this);
		this.descendants().outgoers('edge').removeClass('hidden');
	}
	else if (this.hasClass('expanded'))
	{
		this.descendants().each( function(i, ele)
		{
			if (ele.parent().hasClass('expanded'))
			{
				var x = ele.position().x;
				var y = ele.position().y;
				var rel = {x: x, y: y};
				console.log("Save position for: ", ele.id(), " at: ", rel)
				ele.data('displacement', rel);		
			}
		});

		collapse(this);

		//also hide all the edges that connect nodes, edges connecting a child to a compound child will remain otherwise

		this.descendants().outgoers('edge').addClass('hidden');
	}
})

function checkCompoundBounds(compounds, mouse, testobj)
{
	compounds.forEach(function(ele)
	{
		var pos = ele.renderedBoundingBox();
		//check if in the bounding box
		if (mouse.x > pos.x1 && mouse.x < pos.x2)
		{
			if (mouse.y > pos.y1 && mouse.y < pos.y2)
			{
				if (held_node !== ele)
				{
					//held_node was dropped here
					testobj.added = true;
					testobj.parent = ele.id();
					//held_node was dropped into a compound node, but we need to check for nested compound nodes within
					checkCompoundBounds(ele.children(':parent.expanded').difference(ele), mouse, testobj);
				}
			}
		}
	})
}

function expand(parent)
{
	console.log("Expand:", parent.id());
	var parent_position = parent.position();

	if (parent.hasClass('collapsed'))
	{
		parent.descendants().each( function(i, ele)
		{
			ele.stop(false, true);
			var dx = this.data('displacement').x;
			var dy = this.data('displacement').y;
			console.log(ele.id(), "X: ", + dx, "Y: ", dy);
			ele.animate({
					position: 
				  	{ 
				  		x: dx, 
				  		y: dy
				  	},
				  	style:
				  	{
				  		opacity: 1,
				  	},
				  	complete: function()
					{
						if (ele.isParent())
						{
							ele.removeClass('collapsed');
							ele.addClass('expanded');
						}
				  	}
				}, 
				{
					duration: 500
				});
			ele.removeClass('hidden');
		});

		parent.removeClass('collapsed');
		parent.addClass('expanded');
	}
	// //recursively expand children
	// parent.children(':parent').each(function(i, ele){
	// 	expand(ele);
	// })
}

function collapse(parent)
{
	console.log("Collapse:", parent.id());

	if (parent.animated())
		return;
	var parent_position = parent.position();

	if (parent.hasClass('expanded'))
	{
		parent.descendants().each( function(i, ele)
		{
			ele.stop(false, true);
			ele.animate({
					position: 
				  	{ 
				  		x: parent_position.x, 
				  		y: parent_position.y
				  	},
				  	style:
				  	{
				  		opacity: 0,
				  	},
					complete: function()
					{
						ele.addClass('hidden');
						if (ele.isParent())
						{
							ele.addClass('collapsed');
							ele.removeClass('expanded');
						}
					}
				}, 
				{
					duration: 500
				});
		})
		parent.addClass('collapsed');
		parent.removeClass('expanded');
	}
}

//****** General canvas events ********

cy.on('tap', ':selected', function(event)
{
	console.log("Tapped on: ", cy.$(':selected').data('name'));
	if (current_state === states.CONNECTING)
	{
		createConnection(event.cyTarget);
	}
});

//add nodes/edges to page
cy.on('tap', function(event)
{
	var evtTarget = event.cyTarget;
	
	if (evtTarget === cy)
	{
		console.log("touch screen unselect")
		cy.$(':selected').unselect(); //touch screen doesn't seem to do this by default
	}
	else
	{
		return;
	}
	if (current_state === states.CONNECTING)
	{
		// method to "deselect" a source node for connections
		if (evtTarget === cy)
		{
			if (source_node !== null)
			{
				//remove source node
				source_node.removeClass("source_node"); //remove the style associated with source nodes
				source_node = null; //remove stored source node
			}
		}
	}
	
	if (current_state === states.NEWPAGE)
	{
		console.log("Add a node");
		if (evtTarget === cy) //tap on background
		{					
			console.log("Really Add a node" + cy.add(
			{
				data:
				{ 
					name: cy.nodes('.page, .control').size() + 1, 
					pagestyle: selected_page_template.data.pagestyle,
					outputcontainer: selected_page_template.data.outputcontainer,
					debugcontainer: selected_page_template.data.debugcontainer,
					imgcontainers: selected_page_template.data.imgcontainers,
					vidcontainers: selected_page_template.data.vidcontainers,
					textcontainers: selected_page_template.data.textcontainers,
					decisioncontainers: [],
					specialbuttons: selected_page_template.data.specialbuttons,
					events: [],
					eventspane: '<div class= "eventscontainer">'
						+		'<span class="eventspanetitle eventname" style="text-align:center; font-size: 16px;">Asset</span>'
						+		'<span class="eventspanetitle eventtype" style="text-align:center; font-size: 16px;">Event</span>'
						+		'<span class="eventspanetitle eventtrigger" style="text-align:center; font-size: 16px;">Trigger</span>'
						+		'</div>',
				},
				classes: "page",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			}).data());
		}
		if (cy.elements('.page').size() === 1)
			cy.$('.page').first().addClass('start');	
	}
	
	else if (current_state === states.NEWCONTROL)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					name: cy.nodes('.page, .control').size() + 1, 
					priorityList: [],	//list to store order in which edges are assessed during gameplay
					defaultFailEdge: "none"
				},
				classes: "control",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}		
	}
	else if (current_state === states.NEWJUMP)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					name: "Jump " + (cy.nodes('.jump').size() + 1),
					triggerType: null,
					button: null,
					conditions: [],
					origin: null,
					repeat: "Repeatedly",
				},
				classes: "jump",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}		
	}
	else if (current_state === states.NEWJUMPEND)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					name: "Jump End",
					trigger: "none",
				},
				classes: "jumpend",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			})
		}		
	}
	else if (current_state === states.NEWFIGHT)
	{
		if (evtTarget === cy) //tap on background
		{		
			createFight(event);
		}		
	}
	else if (current_state === states.NEWSTORE)
	{
		if (evtTarget === cy) //tap on background
		{		
			cy.add(
			{
				data: { 
					name: "Group", 
				},
				classes: "expanded",
				group: "nodes",
				renderedPosition: event.cyRenderedPosition,
			},
			{

			})
		}		
	}
	else if (current_state === states.NEWEMPTY)
	{
		if (evtTarget === cy) //tap on background
		{		
			empty_collection = cy.add([
				{
					data: { 
						id: "Emptyparent1" + cy.nodes(':parent').size() + 1,
						name: "Group", 
					},
					classes: "expanded",
					group: "nodes",
				},
				{
					data:
					{
						displacement: {x: 0, y: 0},
						parent: "Emptyparent1" + cy.nodes(':parent').size() + 1,
						name: cy.nodes('.page, .control').size() + 1, 
						pagestyle: selected_page_template.data.pagestyle,
						outputcontainer: selected_page_template.data.outputcontainer,
						debugcontainer: selected_page_template.data.debugcontainer,
						imgcontainers: selected_page_template.data.imgcontainers,
						vidcontainers: selected_page_template.data.vidcontainers,
						textcontainers: selected_page_template.data.textcontainers,
						decisioncontainers: [],
						events: [],
						eventspane: '<div class= "eventscontainer">'
							+		'<span class="eventspanetitle eventname" style="text-align:center; font-size: 16px;">Asset</span>'
							+		'<span class="eventspanetitle eventtype" style="text-align:center; font-size: 16px;">Event</span>'
							+		'<span class="eventspanetitle eventtrigger" style="text-align:center; font-size: 16px;">Trigger</span>'
							+		'</div>',
					},
					classes: "page",
					group: "nodes",
					renderedPosition: event.cyRenderedPosition,
				}
			])
		}		
	}
})

cy.on('select', function(event)
{
	//some dynamic colouring of relevant edges/nodes to the selected node
	if (event.cyTarget.isNode())
	{
		event.cyTarget.outgoers().addClass('parent-selected'); //distinguish edges coming from this node
		//event.cyTarget.successors().leaves().addClass('leaf'); //distinguish the end points reachable from this node	
	}
	
	console.log("Select event fired ", event.cyTarget.data('id'));
	//disable the additive selection behaviour when holding ctrl, alt, shift when we are in connection mode
	if (current_state === states.CONNECTING)
	{
		if (event.cyTarget.isEdge())
		{
			defaultState();		//leave connection state
			showOverlayLinks(event.cyTarget);
		}
		
		var oldselect = cy.$(':selected').diff(event.cyTarget);
		oldselect.left.unselect();
		console.log("disable ctrl behaviour")
		//if adding a new connection
		createConnection(event.cyTarget);
	}
	showOverlayLinks(event.cyTarget);
	
	$(".selectionbutton").show();
})

cy.on('unselect', function(event)
{
	if (event.cyTarget.isNode())
	{
		event.cyTarget.outgoers().removeClass('parent-selected'); //distinguish edges coming from this node
		//event.cyTarget.successors().leaves().removeClass('leaf'); //distinguish the end points reachable from this node	
	}

	console.log("Unselect event fired ", event.cyTarget.data('id'));

	if (cy.$(':selected').size() === 0) //sometimes we had more than one selected
	{
		$(".editbutton").hide();
		$(".selectionbutton").hide(); //delete and edit buttons
	}
	else
	{
		showOverlayLinks(cy.$(':selected')[0])
	}
})


function createFight(event)
{
	var store_start = cy.$('.start');

	var xy = event.cyRenderedPosition;
	console.log(event.cyRenderedPosition);

	var fight_add = cy.add(fight_objects);

	var fight_collection = cy.collection(fight_add)

	$.each(fight_collection.nodes(), function(index, val) {
		if (index > 0)
		{
			if (this.data('displacement') !== undefined)
			{
				var dx = this.data('displacement').x;
				var dy = this.data('displacement').y;
				console.log(dx);
				console.log(dy);
				fight_collection[index].stop(false, true);
				fight_collection[index].animate({
					  position: { x: event.cyPosition.x + dx, y: event.cyPosition.y + dy},
					}, {
					  duration: 500
					});
			}
		}
	});
	
	/*//copy necessary attributes
	for(var k in fight_attributes) 
		project_project.gameAttributes[k] = fight_attributes[k];
*/
	for(var k in fight_attributes)
	{
		//push into PLAYER
		if(k == 'PLAYER')
		{
			for(var a in fight_attributes[k]) {
				project_project.gameAttributes['PLAYER'][a] = fight_attributes[k][a];
				if(updatePlayerChildren)
				{
					project_project.gameAttributes['PLAYER'].childrenArray.push(a);
					updatePlayerChildren = false;
				}
			}
		}else //push into ENEMIES
		{
			for(var a in fight_attributes[k]) {
				project_project.gameAttributes['ENEMIES'][a] = fight_attributes[k][a];

				if(updateEnemiesChildren){
					project_project.gameAttributes['ENEMIES'].childrenArray.push(a);
					updateEnemiesChildren = false;
				}

			}

		}

	}


	setStart(store_start);
	cy.getElementById("72e94087-01f9-477d-941c-3fb29652b431").select();
}

//***** BUG FIX LOOP *******

function fixDisappearingBug()
{
	if (cy.$('.start').size() !== 0)
		cy.$('.start').data('fakeattribute', 1);
}

var fixbug = setInterval(function()
{
	fixDisappearingBug();
}, 200);