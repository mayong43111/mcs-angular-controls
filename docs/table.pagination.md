# 带翻页效果的表格控件 mcs-table-pagination
翻页表格控件可以通过2种方式加载数据，并且支持跨页选择（单选、多选），当前页面全选等功能。不推荐使用此控件做编辑功能，如果有表格数据编辑需求请使用 ** 控件。
> 数据格式必须是PagedQueryResult格式  
返回的数据必须包含翻页信息

> 数据必须有唯一的标识字段（id）和名称（name）  
绑定的数据源格式是 Array<{ id, name }>,其中name不会影响列表的显示，也不会被列表更新。

> 通过callback方式可以获取到控件的控制类  
由于控件渲染晚于controller，所以需要回调才可以拿到控件  
此内容有可能被改进
***
## 示例
[简单用法演示](../example/table.pagination.html)
***
## 用法
### Webapi 的定义
* 接受HttpPost请求并且参数格式为：MCS.Library.Data.PagedQueryCriteria<TCondition>
* 返回格式为：MCS.Library.Data.PagedQueryResult<T, TCollection>  

例如
```
[HttpPost]
public PagedQueryResult<College, CollegeCollection> Query(PagedQueryCriteria<CollegeModelCriteria> criteria)
{
    return CollegeDataSource.Instance.Query(criteria.PageParams, criteria.Condition, criteria.OrderBy);
}
```
CollegeModelCriteria 为自定义查询参数
```
public class CollegeModelCriteria
{
    /// <summary>
    /// 按照名称模糊匹配
    /// </summary>
    [ConditionMapping("CollegeName", EscapeLikeString = true, Prefix = "%", Postfix = "%", Operation = "LIKE")]
    public string CollegeName { get; set; }
}
```

### 前端的定义
在table上增加mcs-table-pagination标记
#### 从服务器端加载数据
##### html
``` 
<table class="table table-bordered" mcs-table-pagination="gridOptions" binding-value="normal_val">
    <thead>
        <tr>
            <th>标识</th>
            <th>名称</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
        </tr>
    </tbody>
</table>
``` 
thead 中的内容作为列表表头的模板  
tbody 中包含的内容作为列表的模板  
item 作为关键词表示当前行数据，只能用于tbody中  

##### javascript
```
$scope.gridOptions = {
    async: {
        url: '/XGKWebApp/XGK/api/sample/query'
    }
}
```
url 地址提供的服务必须符合接口要求

#### 客户端自行加载数据
##### html
``` 
<table class="table table-bordered" mcs-table-pagination="gridOptions" binding-value="normal_val">
    <thead>
        <tr>
            <th>标识</th>
            <th>名称</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>{{item.id}}</td>
        </tr>
        <tr>
            <td>{{item.name}}</td>
        </tr>
    </tbody>
</table>
``` 
tbody中可以包含复杂结构，包括多行、合并行、合并列等  
##### javascript
```
var loadPaginationData = function (pagedQueryCriteria) {
    ...
};

$scope.gridOptions = {
    adapter: {
        loadPaginationData: loadPaginationData
    }
}
```
客户段自行加载数据，可以直接返回数据，也可以返回 angularjs中 $q 创建的promise  
***
## 参数
### binding-value 属性
双向绑定数据
数据类型: Array<{id,name}>
```
[
    { id: '001', name: '第一行数据'},
    { id: '002', name: '第二行数据'},
]
```
默认值: []
当单选模式时，数组中只包含一行记录，如果初始化对象为多行记录时，会清除第一项以外的内容。

### options 属性
通过 mcs-table-pagination="options" 方式赋值  

#### pageSize  
分页大小  
数据类型: number  
默认值: 20  

#### adapter
设置客户端调用属性  
数据类型: object  
默认值: null  

##### adapter.loadPaginationData  
从客户端加载数据，当同时设置了async的url属性时，此属性失效
```
(pagination: PagedQueryCriteria) => ng.IPromise<PaginationData>
```
或
```
(pagination: PagedQueryCriteria) => PaginationData
```

#### async
设置异步调用属性  
数据类型: object  
默认值: null  

##### async.url
设置异步调用webapi的地址
数据类型: string;
默认值: null

##### async.params
设置传递给webapi的查询条件，对应PagedQueryCriteria中的Condition  
数据类型: object;  
默认值: null  

##### async.orderBy
设置传递给webapi的排序，对应PagedQueryCriteria中的OrderBy  
数据类型: Array<{ dataField, sortDirection }>  
默认值: []  
sortDirection对应枚举值
```
public enum FieldSortDirection
{
    /// <summary>
    /// 升序
    /// </summary>
    Ascending,

    /// <summary>
    /// 降序
    /// </summary>
    Descending
}
```

#### callback
设置客户端回调  
数据类型: object  
默认值: null  

##### callback.onInitiated
当控件渲染完成时，回调此方法
```
(controller: $TablePaginationController) => void
```
### readonly 属性
双向绑定数据  
数据类型: Boolean  
默认值: false  
当只读时，不显示选择框，也无法通过控件页面操作修改binding-value数据。
***
## 方法

### search 方法
重新根据指定条件和排序规则加载列表内容  
如不指定条件或排序，则使用当前条件和排序
```
(params?: any, orderBy?: Array<OrderByRequestItem>) => void
```
### refresh 方法
刷新当前分页列表内容或指定分页列表内容，如不指定则表示当前分页
```
(pagination?: Pagination) => void
```
***
## 事件
无


