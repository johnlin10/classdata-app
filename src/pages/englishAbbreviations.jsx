import React, { useEffect, useState } from "react";
import "./css/englishAbbreviations.scss";
// Icon Library
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function EnglishAbbreviations(props) {
  // 頁面動畫
  const [pageTitleAni, setPageTitleAni] = useState(true);
  useEffect(() => {
    setPageTitleAni(false);
  }, []);
  return (
    <main
      id="engAbbreviations"
      className={`${props.theme}${props.theme && props.settingPage ? " " : ""}${
        props.settingPage ? "settingOpen" : ""
      }`}>
      <div className={`view${pageTitleAni ? " PTAni" : ""}`}>
        <div id="engAbbreviationsWarning">
          <span>
            <FontAwesomeIcon
              icon="fa-solid fa-triangle-exclamation"
              bounce
              style={{ color: "#d03d23" }}
            />
            此內容由 AI 生成，可能存在錯誤。
          </span>
          <br />
          <span>最後更新於 2023/4/26</span>
        </div>
        <div id="engAbbreviationsTable">
          <table>
            <thead>
              <tr>
                <th>英文簡稱</th>
                <th>英文完整名稱</th>
                <th>中文名稱</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SSI</td>
                <td>Small-Scale Integration</td>
                <td>小型積體電路</td>
              </tr>
              <tr>
                <td>MSI</td>
                <td>Medium-Scale Integration</td>
                <td>中型積體電路</td>
              </tr>
              <tr>
                <td>LSI</td>
                <td>Large-Scale Integration</td>
                <td>大型積體電路</td>
              </tr>
              <tr>
                <td>VLSI</td>
                <td>Very Large-Scale Integration</td>
                <td>超大型積體電路</td>
              </tr>
              <tr>
                <td>ULSI</td>
                <td>Ultra Large-Scale Integration</td>
                <td>極大型積體電路</td>
              </tr>
              <tr>
                <td>ALU</td>
                <td>Arithmetic Logic Unit</td>
                <td>算術邏輯單元</td>
              </tr>
              <tr>
                <td>ACC</td>
                <td>Accumulator</td>
                <td>累加器</td>
              </tr>
              <tr>
                <td>CU</td>
                <td>Control Unit</td>
                <td>控制單元</td>
              </tr>
              <tr>
                <td>IU</td>
                <td>Instruction Unit</td>
                <td>指令控制單元</td>
              </tr>
              <tr>
                <td>OU</td>
                <td>Output Unit</td>
                <td>輸出控制單元</td>
              </tr>
              <tr>
                <td>MU</td>
                <td>Memory Unit</td>
                <td>記憶體控制單元</td>
              </tr>
              <tr>
                <td>MDR</td>
                <td>Memory Data Register</td>
                <td>記憶體資料暫存器</td>
              </tr>
              <tr>
                <td>MAR</td>
                <td>Memory Address Register</td>
                <td>記憶體位址暫存器</td>
              </tr>
              <tr>
                <td>PC</td>
                <td>Program Counter</td>
                <td>程式計數器</td>
              </tr>
              <tr>
                <td>IR</td>
                <td>Instruction Register</td>
                <td>指令寄存器</td>
              </tr>
              <tr>
                <td>ID</td>
                <td>Instruction Decoder</td>
                <td>指令解碼器</td>
              </tr>
              <tr>
                <td>MIPS</td>
                <td>Million Instructions Per Second</td>
                <td>每秒百萬指令數</td>
              </tr>
              <tr>
                <td>CPU</td>
                <td>Central Processing Unit</td>
                <td>中央處理器</td>
              </tr>
              <tr>
                <td>ROM</td>
                <td>Read-Only Memory</td>
                <td>唯讀記憶體</td>
              </tr>
              <tr>
                <td>RAM</td>
                <td>Random Access Memory</td>
                <td>隨機存取記憶體</td>
              </tr>
              <tr>
                <td>EU</td>
                <td>Execution Unit</td>
                <td>執行單元</td>
              </tr>
              <tr>
                <td>SP</td>
                <td>Stack Pointer</td>
                <td>棧指針</td>
              </tr>
              <tr>
                <td>BP</td>
                <td>Base Pointer</td>
                <td>基址指針</td>
              </tr>
              <tr>
                <td>DI</td>
                <td>Destination Index</td>
                <td>目標索引</td>
              </tr>
              <tr>
                <td>SI</td>
                <td>Source Index</td>
                <td>源索引</td>
              </tr>
              <tr>
                <td>AH</td>
                <td>Accumulator High</td>
                <td>累加器高位</td>
              </tr>
              <tr>
                <td>BH</td>
                <td>Base Register High</td>
                <td>基址寄存器高位</td>
              </tr>
              <tr>
                <td>CH</td>
                <td>Counter High</td>
                <td>計數器高位</td>
              </tr>
              <tr>
                <td>DH</td>
                <td>Data Register High</td>
                <td>數據寄存器高位</td>
              </tr>
              <tr>
                <td>AL</td>
                <td>Accumulator Low</td>
                <td>累加器低位</td>
              </tr>
              <tr>
                <td>BL</td>
                <td>Base Register Low</td>
                <td>基址寄存器低位</td>
              </tr>
              <tr>
                <td>CL</td>
                <td>Counter Low</td>
                <td>計數器低位</td>
              </tr>
              <tr>
                <td>DL</td>
                <td>Data Register Low</td>
                <td>數據寄存器低位</td>
              </tr>
              <tr>
                <td>BIU</td>
                <td>Bus Interface Unit</td>
                <td>總線接口</td>
              </tr>
              <tr>
                <td>CS</td>
                <td>Code Segment</td>
                <td>代碼段</td>
              </tr>
              <tr>
                <td>DS</td>
                <td>Data Segment</td>
                <td>資料段暫存器</td>
              </tr>
              <tr>
                <td>ES</td>
                <td>Extra Segment</td>
                <td>擴充段暫存器</td>
              </tr>
              <tr>
                <td>SS</td>
                <td>Stack Segment</td>
                <td>堆疊段暫存器</td>
              </tr>
              <tr>
                <td>IP</td>
                <td>Instruction Pointer</td>
                <td>指令指標</td>
              </tr>
              <tr>
                <td>AGP</td>
                <td>Accelerated Graphics Port</td>
                <td>加速影像處理埠</td>
              </tr>
              <tr>
                <td>SATA</td>
                <td>Serial ATA</td>
                <td>序列 ATA</td>
              </tr>
              <tr>
                <td>DDR</td>
                <td>Double Data Rate</td>
                <td>雙倍資料速率</td>
              </tr>
              <tr>
                <td>DDR SDRAM</td>
                <td>
                  Double Data Rate Synchronous Dynamic Random Access Memory
                </td>
                <td>雙倍資料率同步動態隨機存取記憶體</td>
              </tr>
              <tr>
                <td>SDRAM</td>
                <td>Synchronous Dynamic Random-Access Memory</td>
                <td>同步動態隨機存取記憶體</td>
              </tr>
              <tr>
                <td>USB</td>
                <td>Universal Serial Bus</td>
                <td>通用序列匯流排</td>
              </tr>
              <tr>
                <td>COM</td>
                <td>Communication Port</td>
                <td>序列埠</td>
              </tr>
              <tr>
                <td>IDE</td>
                <td>Integrated Drive Electronics</td>
                <td>集成驅動器電子學</td>
              </tr>
              <tr>
                <td>PCI</td>
                <td>Peripheral Component Interconnect</td>
                <td>外設組件互連標準</td>
              </tr>
              <tr>
                <td>PCI-E</td>
                <td>Peripheral Component Interconnect Express</td>
                <td>外設組件高速互連標準</td>
              </tr>
              <tr>
                <td>LPT</td>
                <td>Line Printer Terminal</td>
                <td>打印機並行端口</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
