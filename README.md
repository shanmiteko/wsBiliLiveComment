# BiliBili 直播间弹幕
包括全区礼物广播, 投喂信息, 入场信息, 人气值等  

直播间`WebSocket`传输数据格式
```
Packet Header Format

 0                   1           
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  PL   |HL |PV |  Op   |Seq ID |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                               |
|             Data              |
|                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+


PL:  4 bits

  Packet Length

HL:  2 bits

  Header Length

    16 - HEADER_TOTAL_LENGTH

PV:  2 bits

  Protocol Version
  
    1 - HEADER_DEFAULT_VERSION
    0 - BODY_PROTOCOL_VERSION_NORMAL
    2 - BODY_PROTOCOL_VERSION_DEFLATE


Op:  4 bits

  Operation

    1 - HEADER_DEFAULT_OPERATION
    2 - OP_HEARTBEAT
    3 - OP_HEARTBEAT_REPLY
    5 - OP_MESSAGE
    7 - OP_USER_AUTHENTICATION
    8 - OP_CONNECT_SUCCESS


Seq ID:  4 bits

  Sequence Id

    1 - HEADER_DEFAULT_SEQUENCE


Data: ANY bits

  if PV = 0 then Data is UTF-8 Code JSON Format
  if PV = 2 then Data is Gzip
    Unzip: Data -> Header0 + Data0 + Header1 + Data1 + ...
      And Data(n) is also UTF-8 Code JSON Format

```

## 初始化
`GET` [https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo](https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo)  

获取所需的`HostList` `key`  

<table border="1" cellpadding="1" cellspacing="1" style="width:500px">
    <tbody>
        <tr>
            <td>HostList</td>
            <td>WebSocket主机列表</td>
        </tr>
        <tr>
            <td>key</td>
            <td>身份识别</td>
        </tr>
    </tbody>
</table>

连接至WebSocket服务器