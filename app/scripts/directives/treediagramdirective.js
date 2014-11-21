(function() {
  'use strict';
  var dd,
    __slice = [].slice;

  dd = function() {
    var v;
    v = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return console.log(v);
  };

  angular.module('angularTreeDiagramApp').directive('treeDiagramDirective', function($http) {
    return {
      restrict: 'A',
      templateUrl: '/views/tree.html',
      controller: 'MainCtrl',
      transclude: true,
      link: function(scope, element) {
        scope.nodeWidth = 200;
        scope.nodeHeight = 100;
        scope.viewHeight = element.innerHeight;
        scope.zoom = 1;
        scope.draggingNode = null;
        scope.selectedElements = [];
        scope.nodes = {};
        scope.roots = {};
        scope.maxNodeDisplay = 20;
        scope.Math = Math;
        scope.treeExpandAll = false;
        scope.showModal = false;
        scope.treeRootsElements = element[0].querySelector('.tree-roots-elements');
        scope.newNode = function(extend) {
          var nn;
          nn = {
            id: Math.random() + '-' + Math.random() + '-' + Math.random(),
            displayName: 'noname',
            hasChildren: false,
            parentId: null,
            children_count: 0,
            childless_count: 0
          };
          extend && _.extend(nn, extend);
          return nn;
        };
        scope.addNewNode = function() {
          scope.showModal = true;
          scope.modalPath = '/views/editFoem.html';
          scope.formNode = scope.newNode();
          return null;
        };
        scope.editNode = function() {
          scope.showModal = true;
          scope.modalPath = '/views/editFoem.html';
          scope.formNode = scope.nodes[document.querySelector('.rect.selected').parentNode.parentNode.getAttribute('id')];
          return null;
        };
        scope.acceptForm = function() {
          scope.showModal = false;
          if (!scope.nodes[scope.formNode.id] && !scope.formNode.parentId) {
            scope.roots[scope.formNode.id] = scope.formNode;
          }
          scope.nodes[scope.formNode.id] = scope.formNode;
          delete scope.formNode;
          return null;
        };
        scope.cancelForm = function() {
          scope.formNode = {};
          scope.showModal = false;
          return null;
        };
        scope.treeNodeExpand = function(id, allow_max) {
          var k, obj, _ref, _ref1;
          if (allow_max == null) {
            allow_max = false;
          }
          if (!scope.treeExpandAll) {
            if (scope.nodes[scope.nodes[id].parentId]) {
              _ref = scope.nodes[scope.nodes[id].parentId].children;
              for (k in _ref) {
                obj = _ref[k];
                if (scope.nodes[k].toggle) {
                  scope.treeNodeCollapse(k);
                }
              }
            } else {
              _ref1 = scope.roots;
              for (k in _ref1) {
                obj = _ref1[k];
                scope.treeNodeCollapse(k);
              }
            }
          }
          if (!(allow_max || scope.nodes[id].children_count <= scope.maxNodeDisplay)) {
            scope.nodes['compact' + id] = {
              id: 'compact' + id,
              displayName: scope.nodes[id].children_count + ' элементов скрыто',
              compacted: true,
              parentId: id
            };
          }
          scope.nodes[id].toggle = true;
          return null;
        };
        scope.treeNodeCollapse = function(id) {
          if (scope.nodes['compact' + id]) {
            delete scope.nodes['compact' + id];
          }
          scope.nodes[id].toggle = false;
          return null;
        };
        scope.expandAll = function() {
          var id, node, _ref, _ref1;
          scope.treeExpandAll = !scope.treeExpandAll;
          if (scope.treeExpandAll) {
            scope.zoom = 0.5;
            scope.treeRootsElements.moved.x = 0;
            $('.tree-roots-elements').css({
              transform: 'translate(0px,100px) scale(' + scope.zoom + ')'
            });
            _ref = scope.nodes;
            for (id in _ref) {
              node = _ref[id];
              if (scope.nodes[id].hasChildren && !scope.nodes[id].mobsCount) {
                scope.nodes[id].toggle = true;
              }
            }
          } else {
            scope.zoom = 1;
            scope.treeRootsElements.moved.x = $('#groups').width() / 2 - _.size(scope.treeRoots) * 230 / 2;
            $('.tree-roots-elements').css({
              transform: 'translate(' + ($('#groups').width() / 2 - _.size(scope.treeRoots) * 230 / 2) + 'px,100px) scale(' + scope.zoom + ')'
            });
            _ref1 = scope.nodes;
            for (id in _ref1) {
              node = _ref1[id];
              if (scope.nodes[id].hasChildren && !scope.nodes[id].mobsCount) {
                scope.nodes[id].toggle = false;
              }
            }
          }
          return null;
        };
        scope.toogleNode = function(event, id) {
          if (scope.nodes[id].toggle) {
            scope.treeNodeCollapse(id);
          } else {
            scope.treeNodeExpand(id);
          }
          return null;
        };
        scope.$on('NODE_DRAG_START', function(event, id) {
          scope.treeNodeCollapse(id);
          $('.tree-drop-circle:not(.tree-drop-circle' + id + ')').addClass('cshow');
          $('#' + id + ' .tree-drop-circle').removeClass('cshow');
          scope.treeNodeDragging = true;
          scope.draggingNode = id;
          return null;
        });
        scope.$on('NODE_DRAG_END', function(event, id) {
          $('.tree-drop-circle').removeClass('cshow');
          scope.treeNodeDragging = false;
          scope.draggingNode = null;
          return null;
        });
        scope.treeDropAreaMouseenter = function(event, id) {
          scope.newParent = id;
          $('.tree-drop-circle' + id).addClass('h');
          return null;
        };
        scope.treeDropAreaMouseleave = function(event, id) {
          scope.newParent = null;
          $('.tree-drop-circle' + id).removeClass('h');
          return null;
        };
        $http.get('/data').success(function(data) {
          var id, obj;
          scope.nodes = data;
          for (id in data) {
            obj = data[id];
            if (!obj.parentId) {
              scope.roots[id] = obj;
            }
          }
          console.log(scope.nodes);
          return null;
        });
        return null;
      }
    };
  });

}).call(this);