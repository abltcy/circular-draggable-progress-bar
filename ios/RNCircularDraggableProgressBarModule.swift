//
//  RNCircularDraggableProgressBarModule.swift
//  RNCircularDraggableProgressBarModule
//
//  Copyright © 2021 Ahmet Baltaci. All rights reserved.
//

import Foundation

@objc(RNCircularDraggableProgressBarModule)
class RNCircularDraggableProgressBarModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
